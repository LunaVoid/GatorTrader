import psycopg2 # for database connection
import pandas as pd # data frames
import os # operating system
from sklearn.preprocessing import MinMaxScaler # from scikit-learn to normalize stock prices (0-1)
import numpy as np # handle arrays, math operations, prep data for pytorch
import torch # deep learning framework to build and train neural networks like LSTMs
from torch.utils.data import Dataset, DataLoader # organize data for training to create a data set and load in batches
import torch.nn as nn # the neural network module of pytorch to build the module architecture (LSTM) and the loss function (MSELoss)
import matplotlib # graph and plot
warnings.filterwarnings("ignore", category=UserWarning, module='pandas.io.sql')
# !!! fix this for prod should be using pandas.read_sql() with SQLAlchemy 
import warnings # hide pandas warning about psycopg2 


torch.manual_seed(42) # these set seeds for pytorch and numpy to ensure reproducibility across the team
np.random.seed(42)

# we are using here a long short-term memory recurrent neural network architecture 
# designed to remember patterns over time
# loss function is mean squared error that measures how wrong the model's predictions are 

class PriceDataSet(Dataset): #defines a custom dataset class for stock sequences needed by pytorch for training
    def __init__(self, X, y):
        # converts numpy arrays into tensors with a feature dimension added via unsqueeze
        # feature dimension needed for LSTM
        self.X = torch.tensor(X, dtype=torch.float32).unsqueeze(-1)
        self.y = torch.tensor(y, dtype=torch.float32).unsqueeze(-1)

    # len and getitem tell pytorch how many samples exist and how to get one
    def __len__(self):
        return len(self.X)
    
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

class LSTMModel(nn.Module): # simple LSTM model with 2 layers, 64 hidden units, and one output
    # first layer processes the input sequence 
    # second layer takes the hidden states from teh first and refines them further
    # hidden units are the number of hidden neurons in each layer so each time step aka day of price is processed 
    # by 64 internal memory cells and lastly, the you reduce the linear result down to a single output aka the predicted next price
    def __init__(self, input_size=1, hidden_size=64, num_layers=2): 
        super(LSTMModel, self).__init__() # required to initalize from pytorch base class
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True) # defines the LSTM layers where batch_first looks like [batch, sequence, feature]
        self.fc = nn.Linear(hidden_size, 1) # the final output layer which takes the last hidden state of size 64 into a single number which is the predicted price

    def forward(self, x): # input is the last 20 days of prices aka x
        lstm_out, _ = self.lstm(x) # gets ouptut from teh LSTM for every time step
        return self.fc(lstm_out[:, -1, :]) # grab the last time step and convert that into a single predicted value using Linear layer

def makePrediction(ticker): # makePrediction is the main function, connects to database to pull data for a specific stock, trains the model, and forecasts future prices
    os.environ['pguser'] = 'sammy'
    os.environ['pgpassword'] = 'password'

    conn = psycopg2.connect(
            host="localhost",
            database="gatortrader",
            user= os.environ['pguser'],
            password=os.environ['pgpassword'])


    # making the query for data (date and closing price) from the database for a specific ticker passed into the function, for certain time frame of five months
    query ="""
    SELECT date, close 
    FROM stocks 
    WHERE name = %s AND date BETWEEN '2024-10-18' AND '2025-03-14'
    ORDER BY date ASC
    """
    df = pd.read_sql(query, conn, params=(ticker,)) # this function is not optimal so change later so warning ignore can be removed !!!
    conn.close()

    scaler = MinMaxScaler() # normalizes the closing prices to a 0-1 range optimal for LSTMs
    df['scaled_price'] = scaler.fit_transform(df[['close']])
    window_size = 20  # input sequence (how many days it should keep in training aka predict every 21st using 20 prices) optimal for the 5 months of data per stocks
    # alter window size with different size data sets make sure it shows patterns correctly but doesn't overfit either 
    X, y = create_sequences(df['scaled_price'].values, window_size)
    dataset = PriceDataSet(X, y) # wraps data in a pytorch dataloader for training with batching and shuffling 
    # shuffling is good for predicting one price, not so good for a sequence for future prices. something to look into on how we can optimize 
    train_loader = DataLoader(dataset, batch_size=64, shuffle=True) 
    model = LSTMModel() # initializes model, loss function, and optimizer (adam is a solid general-purpose optimizer but feel free to research more into it) !!!
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)


    # a loss function is how your model knows how wrong it is aka scorecard for the model where lower the loss the better the predictions in accuracy
    # the optimizer is the algorithmn that adjusts the model's weights to reduce the loss in the future 
    # epoch is one full pass through the entire data set (generate training sequences, divide into batches, loop through each batch ones = 1 epoch)
    # graident is the direction and strength of change needed to reduce the loss
    # model weight is a tunable number inside the model that determines what is an impactful factor that informs the prediction in the model aka what 
    # the model is learning


    # standard pytorch training loop where it goes through the batches here 50 times and trains the model 
    epochs = 50
    for epoch in range(epochs):
        for batch_x, batch_y in train_loader:
            output = model(batch_x)
            loss = criterion(output, batch_y)
            optimizer.zero_grad()
            loss.backward() # computes the graidents
            optimizer.step() # updates the model weights
        print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.item():.4f}")

    model.eval()
    with torch.no_grad():
        # gets the most recent 20 day window and feeds it into the trained model aand gets the predicted price
        last_seq = torch.tensor(df['scaled_price'].values[-window_size:], dtype=torch.float32).unsqueeze(0).unsqueeze(-1)
        prediction = model(last_seq).item()
        predicted_price = scaler.inverse_transform([[prediction]]) # converts scaled prediction back to read world dollar value
        print(f"Predicted Next Closing Price: {predicted_price[0][0]}")

        # calls helper function that uses the last sequence to predict day 1 and uses that to predict day 2 and so on
        # repeats that process recursively and then plots with plot helper function using matplot lib (something to change in the future to be passed to area component) !!!
        predicted_prices = forecast_future_prices(model, df, scaler, window_size=20, days_ahead=7) 
        plot_future_forecast(df, predicted_prices, scaler, window_size=20)


# splits data into overlapping windows 20 prices predict 21, 21 prices predict 22, etc. 
def create_sequences(data, window_size):
    X, y = [], []
    for i in range(len(data) - window_size):
        seq = data[i:i+window_size]
        label = data[i+window_size]
        X.append(seq)
        y.append(label)
    return np.array(X), np.array(y)

# predicts next 7 prices by starting with last 20, using it as part of next input and repeating recursively 
# !!! look to improve this somehow
def forecast_future_prices(model, df, scaler, window_size=20, days_ahead=7):
    model.eval()
    predictions = []

    last_sequence = df['scaled_price'].values[-window_size:].tolist()

    with torch.no_grad():
        for _ in range(days_ahead):
            seq = torch.tensor(last_sequence[-window_size:], dtype=torch.float32).unsqueeze(0).unsqueeze(-1)
            next_pred = model(seq).item()
            predictions.append(next_pred)
            last_sequence.append(next_pred)


    real_preds = scaler.inverse_transform(np.array(predictions).reshape(-1, 1)).flatten()

    return real_preds

# grabs last 20 real prices appends 7 predicted, plots all, shows vertical line to seperate real and predicted
def plot_future_forecast(df, predicted_prices, scaler, window_size):
    import matplotlib.pyplot as plt

    # Get actual prices for plotting context
    real_prices = scaler.inverse_transform(df['scaled_price'].values[-window_size:].reshape(-1, 1)).flatten()
    full_series = list(real_prices) + list(predicted_prices)

    plt.figure(figsize=(10, 5))
    plt.plot(range(len(full_series)), full_series, marker='o', label='Predicted')
    plt.axvline(x=window_size-1, color='gray', linestyle='--', label='Forecast Start')
    plt.title("Last 20 Days + 7-Day Forecast")
    plt.xlabel("Days")
    plt.ylabel("Price ($)")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

# calls to run with NVDA as the ticker
# expect it to take time to run 
if __name__ == "__main__":
    makePrediction("NVDA")
    


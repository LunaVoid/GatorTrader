import { useState } from 'react';

import './App.css';
import './Login.css';
import './components/Navbar.jsx';
import Navbar from './components/Navbar.jsx';
import './Learn.css';
import creditDebit from '../public/creditdebit.jpg';
import checking from '../public/checking.jpg';
import risk from '../public/risk.jpg';
import learnstocks from '../public/learnstocks.jpg';
import investing from '../public/investing.jpg';
import budgeting from '../public/budgeting.jpg';
import retirement from '../public/retirement.jpg';


const topics = [
  { id: "credit-debit", label: "Credit & Debit", description: (
    <>
      <h3>What is a Debit Card?</h3>
      <p>A debit card is a payment card that allows you to access funds directly from your checking account to make purchases or withdraw cash. While this is important to have for emergencies when you need cash from an ATM, you should not use your debit card for daily transactions, as if your debit card information is stolen, the money from your checking account can be directly and immediately accessed and the protection from the bank is not robust, usually with slower reimbursement times as well.</p>

      <h3>What is a Credit Card?</h3>
      <p>A credit card is a payment card that allows you to borrow money from a lender up to a certain credit limit to make purchases or withdraw cash. You are required to pay the amount in full that you spend with it by the due date in monthly installments and interest is paid on the unpaid balance (your credit score is also hurt for years). Not only are they crucial for making a credit score, they also protect you better in cases of theft as customer support and reversal of a credit transaction is faster and more reliable than in that of a debit card. Make sure your credit card has no annual fees!</p>

      <h3>What is a Credit Score?</h3>
      <p>A credit score is a numerical representation of your "creditworthiness" based on your credit history. In other words it's a number used by lenders to assess the risk of lending you money or extending your available credit limit on your credit card. Scores range from 300 to 850 (higher being better), and the factors that affect your score are length of history (you need at least 5 years which is why having a credit card at 18 is so important), payment history (set up automatic pay), amounts owed (pay in full each month), types of credit used, and recent credit inquiries. Your credit card is for life, never close your first one as its age is super important to your score!.</p>

      <h3>Why is Building Credit Important?</h3>
      <p>A higher credit score means you're more likely to be approved for things like: student loans, apartment rentals, mortgages on homes, car loans, and insurance for auto, home, etc. It can also mean lower interest rates on those loans.</p>
    </>
  ),
    image: creditDebit,
   },
  { id: "checkings-savings", label: "Checkings & Savings", description:(
    <>
      <h3>What is a Checking Account?</h3>
      <p>A checking account is a type of bank account that allows for easy access to your money for daily transactions (also known as 'highly liquid'). It is designed for frequent use, for things like deposits, withdrawals, and writing checks.</p>

      <h3>What is a Savings Account?</h3>
      <p>A savings account is a type of bank account that is used to save money and earn interest over time. It is not intended for daily transactions, and transferring money can take time, with limits on the number of transactions per period.</p>

      <h3>Why are Checking Accounts Used?</h3>
      <p>When you turn 18, it's important to have a personal checking account. This is crucial for financial independence, as paychecks and bills are handled through checking accounts. A good habit is to keep enough in checking for expenses and transfer extra money to savings.</p>

      <h3>Why are Savings Accounts Used?</h3>
      <p>Savings accounts are important for accumulating interest over time, helping money keep up with inflation. In 2025, the best savings accounts offer around 3-4% interest, much higher than checking accounts (~0.01%). However, investing is necessary to truly keep up with inflation.</p>
    </>
  ),
  image: checking,
    
   },
  { id: "risk-management", label: "Risk Management", description: (
    <>
      <h3>What is Risk Tolerance? </h3>
      <p>Risk tolerance is the degree of variability in investment that returns that an individual is willing to withstand in their investment portfolio. It reflects the investor's comfort level with the potential losses or gains, those with high risk tolerance and low risk tolerance invest accordingly.</p>

      <h3>What is a Risk Profile?</h3>
      <p>A risk profile is an evaluation of an individual's willingness and ability to take risks, which can be determined by assessment. It encompasses risk tolerance, risk capacity (financial ability to withstand losses), investment goals, time horizon, and current financial situation. </p>

      <h3>How does it change with age?</h3>
      <p>Risk tolerance and profile significantly change with age. 
 
 Young investors (Hey that's you!): Higher risk tolerance because you may have support from family, university, federal, local, and state scholarships, grants, funds, etc. so expenses can be made lower (especially if no loans are taken out). However, more significantly, because you have a longer time horizon to recover from potential losses. You also have less dependents and direct responsibilities that come with children and families, for example.
 Middle aged or retired investors have lower risk tolerance and may diversify their portfolios with more moderate to low risk investment types instead that protect their savings. 
 </p>

      <h3>How can we organize Financial Activities by Risk?</h3>
      <p>(HIGHEST RISK/DANGEROUS)
gambling (100+ percent gain or loss)
cryptocurrency  (10 to 100 percent gain or loss)
individual stocks (FANG) (5 to 20 percent annually gain or loss)
mutual funds and ETFs (5 to 10 percent gain or loss)
corporate bonds (like apple and google) slightly riskier return slightly better (2 to 5 gain or loss)
government bonds inflation protected very safe set by the fed reserve depends on them but typically more than savings 
savings (3-4% annually NO LOSS and if there are any losses there is fed gov protections)
checking no return (0.01% annually NO LOSS and if there are any losses there is fed gov protections) 
(LEAST RISK/SAFEST)
</p>
</>
    
  ),
  image: risk,  },
  { id: "stock-market", label: "Stock Market", description:(
    <>
      <h3>What is the Stock Market?</h3>
      <p>The stock market is a collection of markets and exchanges where buying, selling, and issuance of shares of publicly (not privately) held companies occur. "Going public" is a big deal for companies. The market provides a platform for investors to trade stocks and major markets include: The New York Stock Exchange, the Nasdaq, and The London Stock Exchange.</p>

      <h3>How is Overall Stock Market Performance Measured?</h3>
      <p>It is typically measured using stock market indices. A stock market index is a statistical measure that tracks the performance of a group of stocks (ex. the top 500 companies) representing a particular market or sector. For example, the S&P 500 provides a snapshot of market performance and gauges the health of the broader economy.</p>

      <h3>What is a Stock?</h3>
      <p>A stock, also known as a share or equity, represents ownership in a company. When you own a stock, you own a piece of the company and have a claim on a portion of its assets and earnings. Each company has a set number of stocks traded, which can also be bought back. Each company has an associated ticker which is a symbol to represent the publicly traded company's stock (which is between four to five letters usually) ex. Apple is AAPL</p>

      <h3>How are Stocks Bought and Sold?</h3>
      <p>Stocks are bought and sold through stock exchanges and brokerage accounts, which in modern times are done through online trading platforms like Robinhood, Etrade, etc. It can involve placing orders at specified prices (limit orders). Market data can also be viewed on Yahoo! Finance. </p>

      <h3>What does it Mean to Diversify?</h3>
      <p>Diversifying means to spread your investment across a variety of assets with different attributes, which mean the positive performance can offset the negative performance of other sectors, so overall your portfolio matches the upward trend of the market. Diversification can be in type of asset, sector/industry, geographic, company type (large, mid or small cap where large is huge market capital over 10B, mid is between 2B and 10B, and small is 300M to 2B), etc.</p>
    </>
  ) ,
  image: learnstocks, },
  { id: "investing-trading", label: "Investing and Trading", description:(
  <>
  <h3>What is Investing?</h3>
  <p>Investing is essentially like owning a small portion of the company. By investing you're providing the company with some capital it can use to expand its operations, develop new products, or enter new markets. In return, you have the potential to earn a return on your investment through capital appreciation (aka the increase in a stock's value over time).  Think of it like "believers" in the company, you must be "vested" to be "invested."</p>

  <h3>What is Trading?</h3>
  <p>Trading refers to the buying and selling of financial instruments like stocks, bonds, etc. in financial markets. Investing focuses on long-term growth, while trading is relatively shorter time frames and aims to capitalize on price fluctuations and market trends (which are influenced by financial principles, societal behaviors, global news, etc.), and traders may engage in different (and very risky) strategies such as day trading, swing trading, or options trading, to generate profits.</p>

  <h3>Why do People Invest?</h3>
  <p>Investing can help build financial security over time, as proper investments are ones you do not need to sell, that stay invested for years, and help generate return that can actually compete with the loss money can endure with inflation. Investing can be considered passive income, and it can help people of any age, background, etc. achieve their life and career goals. </p>

  <h3>When Should You Start Investing?</h3>
  <p>You can start investing now! It is crucial to take the advantage of the power of compounding, which is the fact that investments grow exponentially over time. The earlier you start, the more time your money has to grow, and the easier it will be to grow from there! Stocks don't even need to be bought in whole amounts, and you have the option to automatically invest small amounts monthly! </p>
  </>
  ),
  image: investing,},
  { id: "budgeting", label: "Budgeting", description:(
<>
<h3>What is Budgeting?</h3>
<p>Budgeting is the process of creating a plan to manage your income, expenses, and savings on the daily basis. It involves tracking income and earnings, tracking expenditures or spending, identifying spending categories, identifying how much is spent per month or week in each category, and setting financial goals of saving. </p>

<h3>Why do People Budget?</h3>
<p>It helps people "live within their means" and visualize what their financial health looks like and reflect on it. It helps people set goals, manage debt, prepare for emergencies, plan for future career goals and vacations, and gives ultimately a peace of mind. It also allows you to find money to invest and save, which is crucial for financial stability and growth.</p>

<h3>How do People Budget?</h3>
<p>You can use something as simple as Microsoft Excel spreadsheets, Google sheets, etc. or you can use the many apps available to sort through your financial data yourself. All bank account, debit card, and credit card information is downloadable to analyze from their respective websites. When analyzing, find where improvements can be made and devise a plan of action!</p>
</>
  ),
  image: budgeting,
 },
  { id: "retirement", label: "Retirement", description:(
  <>
    <h3>What are Life's Major Expenses?</h3>
    <p>In order the biggest expenses of your life are likely to be the following: college, car, house, and retirement. These are the largest expenses that lead to loans of some type for everyone, down payments and mortgages.</p>

    <h3>How do you Save for these Expenses?</h3>
    <p>The best way to pay for these expenses is to start saving as soon as possible. For college, a 529 plan is ideal. For a car, house, and retirement it is important to invest money into a Roth IRA account and a 401K.</p>

    <h3>What is a Roth IRA?</h3>
    <p>A Roth IRA is an Individual Retirement Account that offers tax advantages. Contributions are made with after-tax dollars, meaning you do NOT get a tax deduction. The money in the account grows tax-free and so does qualified withdrawals for retirement. The annual contribution limit is about 5000 a year and is subject to income limits, so it's best to start at 18! Don't forget to invest what you put in the Roth IRA, it doesn't automatically grow!</p>

    <h3>What is a 401K?</h3>
    <p>A 401K is an employer-sponsored retirement savings plan that allows employees to contribute a portion of their salary to a tax-advantaged retirement account. Contributions are pre-tax again, and employers match your contribution to a certain percent, and you should withdraw later to get larger amounts. </p>
    </>
  ),
  image: retirement, },
];

const Learn = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div>
      <Navbar/>
    <div className="learn-container" >
      <h2 className="title"> Select a circle to start learning:</h2>
      <div className="circle-container">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="circle"
            style={{ backgroundImage: `url(${topic.image})` }} 
            onClick={() => setSelectedTopic(topic)}
          >
            <div className="circle-text">
              {topic.label}
            </div>
          </div>
        ))}
      </div>
      {selectedTopic && (
        <div className="info-box">
        <h2>{selectedTopic.label}</h2>
        <p>{selectedTopic.description}</p>
        <span className="close-btn" onClick={() => setSelectedTopic(null)}>✖</span>
        
      </div>
      )}
    </div>
    <div>

      
    </div>
      
    </div>
  );
};

export default Learn;
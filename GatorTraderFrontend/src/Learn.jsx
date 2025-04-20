import { useEffect, useState } from 'react';

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
import { useUser } from './utils/userContext.jsx';

const topics = [
  { id: "credit-debit", label: "Credit & Debit", description_begin: (
    <>
      <h3>What is a Debit Card?</h3>
      <p>A debit card lets you spend the money you already have in your bank account. It's great for taking out cash from an ATM, but risky to use daily because if someone steals it, they can access your money right away and it takes longer to get it back.</p>

      <h3>What is a Credit Card?</h3>
      <p>A credit card lets you borrow money to pay for things, but you must pay it back later. It’s better protected if stolen, and it helps you build a credit score — just remember to pay on time and avoid cards with fees!</p>

      <h3>What is a Credit Score?</h3>
      <p>Your credit score shows how good you are at paying back money. It helps lenders decide if they can trust you. Scores go from 300 to 850. The higher, the better!</p>

      <h3>Why is Building Credit Important?</h3>
      <p>Good credit makes it easier to get approved for loans, rent, or buy a home, and can save you money through lower interest rates.</p>
    </>
  ), description_int: (
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
  ), description_adv: (
    <>
    <h3>What is a Debit Card?</h3>
    <p>A debit card provides direct access to your checking account funds. It is essential for ATM withdrawals but carries a higher fraud risk for daily transactions due to weaker consumer protections and slower reimbursement times compared to credit cards.</p>

    <h3>What is a Credit Card?</h3>
    <p>A credit card allows borrowing up to a credit limit. Timely full payments avoid interest, and responsible usage helps build credit. Credit cards also offer stronger fraud protection and faster chargeback resolution than debit cards. Prefer cards with no annual fee.</p>

    <h3>What is a Credit Score?</h3>
    <p>A credit score (300–850) reflects your creditworthiness and is based on payment history, credit utilization, length of credit history, credit mix, and recent inquiries. Maintaining an early, long-standing credit account boosts your score significantly.</p>

    <h3>Why is Building Credit Important?</h3>
    <p>A strong credit score enhances your ability to secure loans, rent housing, and obtain favorable insurance rates, while minimizing borrowing costs through reduced interest rates.</p>
  </>
  ),
    image: creditDebit,
   },
  { id: "checkings-savings", label: "Checkings & Savings", description_begin: (
    <>
    <h3>What is a Checking Account?</h3>
    <p>A checking account is a bank account for everyday spending. You can use it to pay bills, get your paycheck, and take out money when needed.</p>
    <h3>What is a Savings Account?</h3>
    <p>A savings account helps you save money and earn some interest. It’s better for money you don’t plan to spend right away.</p>

    <h3>Why are Checking Accounts Used?</h3>
    <p>Once you’re 18, having a checking account is key to managing your money, like paying bills and getting paid. Keep enough for spending and move extra to savings.</p>

    <h3>Why are Savings Accounts Used?</h3>
    <p>They earn more interest than checking accounts. Good for saving money safely, even though better returns come from investing.</p>
    </>
    
  ), description_int:(
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
  ), description_adv: (
    <>
    <h3>What is a Checking Account?</h3>
    <p>Checking accounts are highly liquid financial instruments designed for daily financial transactions such as deposits, withdrawals, electronic payments, and check writing.</p>

    <h3>What is a Savings Account?</h3>
    <p>Savings accounts are interest-bearing deposit accounts intended for capital preservation and gradual growth, typically with withdrawal limits to encourage saving behavior.</p>

    <h3>Why are Checking Accounts Used?</h3>
    <p>Essential for financial independence and managing daily cash flow. Checking accounts serve as the central hub for income receipt, expense management, and bill payment.</p>

    <h3>Why are Savings Accounts Used?</h3>
    <p>Savings accounts serve as an accessible yet secure place to store emergency funds and accrue modest interest—currently 3-4% APY at leading institutions—though they underperform compared to long-term investment strategies.</p>
  </>
  ),
  image: checking,
    
   },
  { id: "risk-management", label: "Risk Management", description_begin: (
    <>
    <h3>What is Risk Tolerance?</h3>
    <p>Risk tolerance is how much risk you're okay with when investing. Some people can handle big ups and downs, others prefer safer bets.</p>

    <h3>What is a Risk Profile?</h3>
    <p>Your risk profile is a mix of your comfort with risk, your goals, how much money you can afford to lose, and how long you can invest.</p>

    <h3>How does it change with age?</h3>
    <p>Young people usually take more risks because they have time to recover. Older people often go safer to protect savings for retirement.</p>

    <h3>How can we organize Financial Activities by Risk?</h3>
    <p>High to low risk: gambling, crypto, individual stocks, ETFs, corporate bonds, government bonds, savings accounts, checking accounts.</p>
  </>

  ),description_int: (
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
  ), description_adv: (
    <>
    <h3>What is Risk Tolerance?</h3>
    <p>Risk tolerance reflects an investor’s psychological comfort with volatility and potential losses in pursuit of returns, influencing portfolio composition and investment strategy.</p>

    <h3>What is a Risk Profile?</h3>
    <p>A risk profile evaluates both risk tolerance and risk capacity, encompassing personal finance goals, time horizon, liabilities, and emotional response to market movements.</p>

    <h3>How does it change with age?</h3>
    <p>Younger investors have higher risk tolerance due to longer time horizons and fewer liabilities. As individuals age, investment goals shift toward capital preservation, reducing exposure to volatile assets.</p>

    <h3>How can we organize Financial Activities by Risk?</h3>
    <p>Risk hierarchy: Gambling &gt; Cryptocurrency &gt; Individual Equities &gt; 
  ETFs/Mutual Funds &gt; Corporate Bonds &gt; Government Bonds (TIPS) &gt; 
  High-Yield Savings &gt; Checking (non-interest bearing).</p>
  </>
  ),
  image: risk,  },
  { id: "stock-market", label: "Stock Market", description_begin: (
    <>
    <h3>What is the Stock Market?</h3>
    <p>The stock market is where people buy and sell parts of companies (called stocks). Big markets include the NYSE and Nasdaq.</p>
    
    <h3>How is Overall Stock Market Performance Measured?</h3>
    <p>By looking at groups of companies, like the S&P 500, which shows how the biggest 500 companies are doing overall.</p>

    <h3>What is a Stock?</h3>
    <p>A stock is a piece of a company. If you own a stock, you own part of that company and can earn money if it does well.</p>

    <h3>How are Stocks Bought and Sold?</h3>
    <p>You can buy or sell stocks online using platforms like Robinhood or E*Trade. Each stock has a symbol like "AAPL" for Apple.</p>

    <h3>What does it Mean to Diversify?</h3>
    <p>Diversifying means spreading your money around different investments so one loss doesn’t hurt your whole portfolio.</p>
  </>
  ), description_int:(
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
  ) , description_adv: (
    <>
    <h3>What is the Stock Market?</h3>
    <p>The stock market facilitates equity trading, capital formation, and liquidity for public companies. Key exchanges include the NYSE, Nasdaq, and LSE.</p>

    <h3>How is Overall Stock Market Performance Measured?</h3>
    <p>Indices like the S&P 500, Dow Jones Industrial Average, and Nasdaq Composite track performance of market segments and serve as economic barometers.</p>

    <h3>What is a Stock?</h3>
    <p>Equity securities represent ownership in a company, entitling shareholders to a proportional share of profits and assets. Stocks trade under unique tickers (e.g., AAPL for Apple).</p>

    <h3>How are Stocks Bought and Sold?</h3>
    <p>Executed through brokerages via market or limit orders, stocks are traded in centralized and electronic marketplaces, with access to real-time pricing and analytics.</p>

    <h3>What does it Mean to Diversify?</h3>
    <p>Diversification mitigates unsystematic risk by allocating investments across asset classes, sectors, geographies, and market caps to stabilize returns.</p>
  </>
    
  ),
  image: learnstocks, },
  { id: "investing-trading", label: "Investing and Trading", description_begin: (
    <>
    <h3>What is Investing?</h3>
    <p>Investing means buying part of a company (or other assets) and holding it to grow your money over time.</p>
    
    <h3>What is Trading?</h3>
    <p>Trading means buying and selling quickly to try to make money fast based on short-term price changes.</p>

    <h3>Why do People Invest?</h3>
    <p>To grow their money over time, beat inflation, and help reach future goals like buying a house or retiring.</p>

    <h3>When Should You Start Investing?</h3>
    <p>The sooner the better! Starting early helps you benefit from compound growth, even with small amounts.</p>
    </>
  ),description_int:(
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
  ), description_adv: (
    <>
    <h3>What is Investing?</h3>
    <p>Investing involves allocating capital into assets like equities or bonds with the intent of long-term wealth accumulation via appreciation or income generation.</p>

    <h3>What is Trading?</h3>
    <p>Trading exploits short-term market inefficiencies for profit using strategies like day trading, swing trading, and derivatives, often requiring technical analysis and risk management.</p>

    <h3>Why do People Invest?</h3>
    <p>To achieve financial independence, hedge against inflation, generate passive income, and fulfill long-term goals through capital appreciation and compound interest.</p>

    <h3>When Should You Start Investing?</h3>
    <p>Investing early maximizes compounding effects. Time in the market generally outperforms attempts at market timing, especially with automatic reinvestment and fractional share access.</p>
    </>
  ),
  image: investing,},
  { id: "budgeting", label: "Budgeting", description_begin: (
    <>
    <h3>What is Budgeting?</h3>
    <p>Budgeting means making a plan for how to use your money wisely. It includes keeping track of how much money you make and how much you spend on things like food, rent, fun, and savings.</p>

    <h3>Why is Budgeting Important?</h3>
    <p>Budgeting helps you not spend more than you earn. It shows you where your money goes so you can make better choices. It also helps you save up for big things like vacations or emergencies, and avoid getting into debt.</p>

    <h3>How Can You Start Budgeting?</h3>
    <p>You can start by writing down your income and your expenses on paper or in a spreadsheet. You can also use apps like Mint, YNAB, or your bank's app to track spending. Try to spend less than you earn, and save a little every month!</p>
    </>
  ),
  description_int:(
<>
<h3>What is Budgeting?</h3>
<p>Budgeting is the process of creating a plan to manage your income, expenses, and savings on the daily basis. It involves tracking income and earnings, tracking expenditures or spending, identifying spending categories, identifying how much is spent per month or week in each category, and setting financial goals of saving. </p>

<h3>Why do People Budget?</h3>
<p>It helps people "live within their means" and visualize what their financial health looks like and reflect on it. It helps people set goals, manage debt, prepare for emergencies, plan for future career goals and vacations, and gives ultimately a peace of mind. It also allows you to find money to invest and save, which is crucial for financial stability and growth.</p>

<h3>How do People Budget?</h3>
<p>You can use something as simple as Microsoft Excel spreadsheets, Google sheets, etc. or you can use the many apps available to sort through your financial data yourself. All bank account, debit card, and credit card information is downloadable to analyze from their respective websites. When analyzing, find where improvements can be made and devise a plan of action!</p>
</>
  ), description_adv:(
    <>
    <h3>What is Advanced Budgeting?</h3>
    <p>Advanced budgeting involves not just tracking income and expenses but forecasting, analyzing trends, and optimizing cash flow. It includes sinking funds, zero-based budgeting, and adjusting monthly plans based on variable income or goals.</p>

    <h3>Why Level Up Your Budget?</h3>
    <p>Mastering advanced budgeting techniques helps you become intentional with every dollar. It maximizes savings potential, eliminates waste, and prepares you for major financial moves—like investing, business ownership, or early retirement.</p>

    <h3>How to Get Advanced?</h3>
    <p>Start using detailed categories, automate savings, and set up multiple sinking funds for upcoming large expenses. Use tools like YNAB (You Need a Budget), Tiller, or advanced Excel models. Track your net worth monthly and review quarterly goals for progress.</p>
    </>
  ),
  image: budgeting,
 },
  { id: "retirement", label: "Retirement", description_begin: (
    <>
    <h3>What is Retirement?</h3>
    <p>Retirement means the time in your life when you stop working full-time, usually in your 60s or 70s. But to do that, you need money saved up so you can live comfortably without a job.</p>

    <h3>Why Save for Retirement?</h3>
    <p>If you start saving early, your money has time to grow. Even saving a little bit each month can add up over many years! Waiting too long means you’ll have to save a lot more later.</p>

    <h3>Easy Ways to Start Saving</h3>
    <p>Open a Roth IRA when you're 18 or start putting money in a 401(k) if your job offers one—especially if they match what you put in. Don’t forget: the money you put in has to be invested to grow, not just sit in cash.</p>
    </>
  ), description_int:(
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
  ), description_adv: (
  <>
    <h3>Planning for Financial Independence</h3>
    <p>Advanced retirement planning is about achieving financial independence—reaching a point where investments cover your living expenses. This may happen before the traditional retirement age if you plan early and aggressively.</p>

    <h3>Strategic Tools for Long-Term Growth</h3>
    <p>Use accounts like Roth IRAs, Traditional IRAs, 401(k), HSA, and brokerage accounts in combination. Understand contribution limits, tax implications, and employer match strategies. Diversify investments across stocks, bonds, ETFs, and real estate.</p>

    <h3>Optimizing Your Path</h3>
    <p>Use compound interest calculators, FIRE (Financial Independence, Retire Early) projections, and tax-efficient withdrawal strategies. Consider maxing out tax-advantaged accounts early in your career and adjusting allocations as you age.</p>
  </>),
  image: retirement, },
];




const Learn = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { levelGetter, token } = useUser();
  const [level, setLevel] = useState("beginner");
  console.log(level)

  useEffect(()=>{
    const levelStuffer = async() => {
      const l = await levelGetter(token);
      setLevel(l);

    }
    try {
      levelStuffer();
    } 
    catch (e){
      console.log(e);
    }
  },[])

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
            style={{ backgroundImage:  `url(${topic.image})` }} 
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
        {level === "beginner" && selectedTopic.description_begin}
        {level === "intermediate" && selectedTopic.description_int}
        {level === "advanced" && selectedTopic.description_adv}
        <span className="close-btn" onClick={() => setSelectedTopic(null)}>✖</span>
        
      </div>
      )}
    <div className = "footer-baralso"></div>
    </div>
    
    
    </div>
  );
};

export default Learn;
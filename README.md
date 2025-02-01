# GatorTrader

# Todo:
- [x] Github branch protection
- [x] invite everyone
- [x] Basic Readme
- [] Flask start
- [] React Router install
- [] Basic React Routing
- [] Connect Postgres Database to backend/Flask




# Basic Guide!

## How to run the frontend 
1. First you need to navigate all the way into the GatorTraderFrontend file
2. Then you need to run this command **npm install** this will install all React Dependencies
3. After that is finished run **npm run dev**
4. You can now make live changes to our beautiful frontend. 

**Reminder** We are going to need to use React Router to create protected routes. So that only logged in users can access certain parts of the oage.
For an example of what I mean here is a chatgpt example: https://chatgpt.com/share/679db0c6-7bf0-800f-a5e5-80af7c8051a8


### Quick random side tangent:
Why is the command not npm start??? Like you may be used too??

**Answer:** Many people don't know this but if you create a React App using create-react-app and it's associated commands
unfortunately you are doing it wrong or at least not optimally. create-react-app is no longer supported and is no longer updated.
It is considerable slower than other alternatives and there are bugs in it that are not patched. We use Vite in this house and
Vite uses the **npm run dev**. 

Learn more at: 
https://dev.to/eslachance/stop-using-create-react-app-7in
https://www.reddit.com/r/webdev/comments/1cuxbvs/is_it_a_bad_decision_using_createreactapp_in_2024/
https://www.freecodecamp.org/news/how-to-create-a-react-app-in-2024/


## How to run the backend:
This one should be relatively easy but there are a few caveats
1. First install all Dependencies using **pip install -r requirements.txt** 
2. Fill in the .env variables the reason for this is explained here: https://chatgpt.com/share/679db26a-8914-800f-91d5-13abc511414f I can also explain more if needed! - Josh
3. Then run python main.py and it should just work. I will update these instructions as things change of course. 


# Important Reminders:
- When editing the backend/adding new packages PLEASE use the requirements.txt. Python doesn't automatically add Dependencies so you need to manually write them in then they can be installed with **pip -r requirements.txt** 

- Please use Flexbox or grid or even block display when using CSS please for the love of god don't use absolute or relative unless you really know what your doing and how to help use work around it. Conflicting CSS is such a nightmare and making mobile compatibility work with absolute positioning is just the worst. 

- Please organize your functions, aka utils in util folder, hooks in hooks folder etc. Take a look at this: https://blog.webdevsimplified.com/2022-07/react-folder-structure/ for more info. We will probably be doing something that is a combination of beginner and intermediate. One good example why we would want to do this is an isAuthenticated() function. We want to be able to run this on every page so we can kick the user back to login if they aren't authenticated. So this function must be either in hooks or in a util folder so it can be imported and accessed by every page.


# Super Important:
**Don't break main** - I have skill issues sometimes and break stuff, and you might too. That doesn't mean your a bad coder and that doesn't mean you don't save your changes. But that does mean you create a new branch and commit to that if you want to save changes in GIT. Otherwise our beautiful working codebase will then break for everyone and everyone will have to help debug yours before it works. Meaning they can't work on their changes because the codebase is el broko. I am extremely guilty of this at my last hackathon lol. So make sure to branch and save your changes and fix your branch and then do a pull request.

**Additional Note** - I just set up branch protection so this shouldn't happen. You have to create a pull request and it needs to be approved by someone. Now I think you can approve your own but still this at least protects main more. Feel free to test it out, I'm not super familiar with github protections.

## How to create a branch:
1. **git checkout -b feature-branch** - Creates a new branch 
2. Make your changes then run **git add . & git commit -m "Fixed login bug"** 
3. Then push your branch to github **git push origin feature-branch**
4. Create a Pull Request on GitHub:
    1. Go to the repo
    2. You’ll see a banner: "Compare & pull request" → Click it.
    3. Ensure the base branch is main and the compare branch is feature-branch
    4. Add a title & description (explain what the PR does).
    5. Click "Create pull request"
5. A team member reviews and approves your PR, then click "Merge pull request"
6. Switch back to main with **git checkout main** and update it with **git pull** to see your changes added to main
7. Then delete your branch **git branch -d feature-branch && git push origin --delete feature-branch**



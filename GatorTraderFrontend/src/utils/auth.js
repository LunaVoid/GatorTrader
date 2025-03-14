export const signUp = async function (userData) {
    try{
        const response = await fetch("http://localhost:5000/api/signup",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        return await response.json();
    }
    catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

export const logIn = async function (userData) {
    try{
        console.log("LOG IN FUNC")
        const response = await fetch("http://localhost:5000/api/login",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        if (!response.ok) {
            throw new Error('Login failed');
        }
        console.log("here in auth")
        const returner = await response.json();
        return returner;


    }
    catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}
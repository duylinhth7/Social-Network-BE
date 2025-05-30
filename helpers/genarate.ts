import jwt from "jsonwebtoken"

export const genarateToken = (length:number):string =>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

export const genarateNumber = (length:number) =>{
    const characters = '0123456789';
    let number = '';
    for (let i = 0; i < length; i++) {
        number += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return number;
}

export const genarateTokenJWT = (user:any):string => {
    return jwt.sign({
        id: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    )
}
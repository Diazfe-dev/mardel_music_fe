const AuthGuard = (user) =>{
    if(!user){
        window.location.href = '/index.html';
    }
}

export default AuthGuard;
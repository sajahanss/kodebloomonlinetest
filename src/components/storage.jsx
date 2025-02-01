export const storeUserData = (data)=>{
    localStorage.setItem('data',JSON.stringify(data))
    localStorage.setItem('phoneNumber',data.phoneNumber)
    localStorage.setItem('email',data.email)
    
}

export const storeexamstate=(state)=>{
   return localStorage.setItem('examstatus',state)
}

export const getexamstate = ()=>{
    return localStorage.getItem('examstatus');
}

export const getUserData = ()=>{

    return localStorage.getItem('data');
}

export const removeUserData = ()=>{
    localStorage.removeItem('data');
}
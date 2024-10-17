models --> 
user model-->fN, uN, pwd, Dp
msgs--> s_id(link w user model), r_id(link w user model), msg
convos--> p[](link w user model), msgs(link w msgs), msg

CONTROLLERS

middleware->
newId/findedUser._id + Secret = JWT Token


signup --> 
1) body(all) + val + salting -> new User (User)
2) token --- newUser.id 

login --> 
1) body(uN,pwd) + val ->login User
2) user exists in db? 
    salting - mongoUser? mongoUser.pwd == pwd?
3) token --- mongoUser.id 

logout --> 
1) body(uN,pwd) 
2) clear jwt 

sendMsg -->

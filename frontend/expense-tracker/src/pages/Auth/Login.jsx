import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';


const Login = () => {
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  // hndle login
  const handleLogin = async (e) => {

    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Plese enter the password");
    }

    setError("");

    //Login Api call

  }
  return (
    <AuthLayout>
      <div className="flex items-center justify-start h-full w-full pl-16">
        <div className="text-left">
          <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">
            Please enter your details to log in 
          </p>

          <form onSubmit={handleLogin}>
            <Input
               value={email}
                onChange={(e) => setEmail(e.target.value)}
               label="Email Address"
               placeholder="john@example.com"
               type="text"
            />

            <Input
               value={password}
                onChange={(e) => setPassword(e.target.value)}
               label="Password"
               placeholder="Min 8 characters"
               type="password"
            />

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary">
              LOGIN
            </button>

            <p className="text-[13px] text-slate-800 mt-3">
              Don't have an account ? {""}
              <Link className="font-medium text-primary underline" to="/signup">
              Signup 
              </Link>
            </p>
          </form>
          
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login

import { contextData } from "@/context/AuthContext";
import { useState } from "react";
import Alert from "./UI/Alert";

export default function TradeModal({tradeType, toggleModal, interestRate}:any) {
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<null | string>(null)
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const { user } = contextData()



  const startTrade = async (e: any) => {
    e.preventDefault()
    setError(null)

    if(tradeType === 'standard') {
      if(amount < 500) return setError("The minimum trade amount is $500")
    }

    if(tradeType === 'advanced') {
      if(amount < 1000) return setError("The minimum trade amount is $1000")
    }

    if(tradeType === 'nfp') {
      if(amount < 50000) return setError("The minimum trade amount is $50000")
    }

    if(tradeType === 'btc') {
      if(amount < 67000) return setError("The minimum trade amount is $67000")
    }
    
    if (amount > user.deposit) return setError("Insufficient balance, deposit and try again later");

    setLoading(true)
    setSuccess(null)

    const interest = interestRate/100

    try {
      const res = await fetch(`${url}/trades/user/${user._id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ interest, amount, package: tradeType })
      })
      const data = await res.json()

      if(res.ok) setSuccess(data.message) 
      else throw new Error(data.message)
    } catch (error: any) {
      setError(error.message)
    } finally{
      setLoading(false)
      setAmount(0)
    }
  }



  return (
      <div className="w-screen h-screen fixed left-0 top-0 z-9999 flex items-center justify-center backdrop-blur px-2">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" action="#" onSubmit={startTrade}>
            <h5 className="text-xl font-medium text-gray-900 dark:text-white capitalize">{tradeType} Trade</h5>
            <div>
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
              <input onChange={(e:any) => setAmount(e.target.value)} value={amount} type="number" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Transfer Amount" required/>
            </div>

            <div className="flex gap-5">
              <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{loading? "Loading...": "Start Trade"}</button>
              <button onClick={() => toggleModal(false)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
            </div>
            {error && <Alert type="danger" message={error} />}
            {success && <Alert type="success" message={success} />}
          </form>
        </div>  
      </div> 
  )
}

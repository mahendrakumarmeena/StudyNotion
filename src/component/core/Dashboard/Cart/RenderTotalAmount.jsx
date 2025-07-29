import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import IconBtn from '../../../common/IconBtn';
import { BuyCourse } from '../../../../services copy/Opreration/studentFeatureAPI';

const RenderTotalAmount = () => {

    const {total, cart} = useSelector((state) => state.cart);
    
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        BuyCourse(token, courses, user, navigate, dispatch)
    }
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      {/* <IconBtn
        text="Buy Now"
        onClick={handleBuyCourse}
        customClasses="w-full justify-center"
      /> */}
      <button onClick={handleBuyCourse} className='rounded-md ml-8 py-1 lg:px-16 px-8 font-semibold text-richblack-900 uppercase tracking-wider bg-yellow-50 '>
        buy now
      </button>
    </div>
  )
}

export default RenderTotalAmount
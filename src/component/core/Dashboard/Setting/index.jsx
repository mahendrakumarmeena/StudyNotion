import React from 'react'
import DeleteAccount from './DeleteAccount'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import ChangeProfilePicture from './ChangeProfilePicture'


function Settings () {
  return (
    <div className='bg-richblue-900 text-white mx-0 md:mx-5 flex flex-col gap-y-5 md:gap-y-7'>
         <p className='font-medium text-richblack-5 text-3xl mb-5 uppercase tracking-wider lg:text-left text-center '>Edit Profile</p>

         {/* Change Profile Picture */}
         <ChangeProfilePicture/>


         {/* Edit Profile information */}
         <EditProfile/>


         {/* Update Password */}
         <UpdatePassword/>


         {/* Delete Account */}
         <DeleteAccount/>
    </div>
  )
}

export default Settings

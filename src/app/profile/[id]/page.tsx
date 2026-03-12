import ProfileHeader from '@/components/profile-header/ProfileHeader'
import Profile from '@/components/profile/Profile'

const ProfilePage = () => {
  return (
    <div className="page">
        <div className="page-content">
            <ProfileHeader />
            <Profile />
        </div>
    </div>
  )
}

export default ProfilePage
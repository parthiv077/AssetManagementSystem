const Profile = ({ user }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gray-100 p-6 rounded-md shadow-md">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-500">Employee ID</p>
                    <p className="font-semibold">{user.employeeId}</p>
                </div>
                <div>
                    <p className="text-gray-500">First Name</p>
                    <p className="font-semibold">{user.employeeFirstName}</p>
                </div>
                <div>
                    <p className="text-gray-500">Middle Name</p>
                    <p className="font-semibold">{user.employeeMiddleName}</p>
                </div>
                <div>
                    <p className="text-gray-500">Last Name</p>
                    <p className="font-semibold">{user.employeeLastName}</p>
                </div>
                <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-semibold">{user.department}</p>
                </div>
                <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold">{user.email}</p>
                </div>
                <div>
                    <p className="text-gray-500">Contact No</p>
                    <p className="font-semibold">{user.contactNo}</p>
                </div>
                <div>
                    <p className="text-gray-500">Role</p>
                    <p className="font-semibold">{user.appRole}</p>
                </div>
 
                <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-semibold">{formatDate(user.dateOfBirth)}</p>
                </div>
                <div>
                    <p className="text-gray-500">Date of Joining</p>
                    <p className="font-semibold">{formatDate(user.dateOfJoining)}</p>
                </div>
                




            </div>
        </div>
    );
};
export default Profile;  
import { RxDashboard } from "react-icons/rx";
import { Calendar,  LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

const PartnerSidebar = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
        onClose();
    };

    return (
        <div className="w-full flex bg-[#1053D4] h-full overflow-auto">
            <div className="w-[90%] mt-[20px] relative">
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-0 right-4 text-white text-2xl"
                >
                    <RxCross2 />
                </button>

                <span>
                    <img src="/newlogo.svg" alt="Logo" />
                </span>
                <div className="w-full mt-[40px] flex flex-col items-center gap-[10px]">
                    <span
                        className="w-[80%] h-[60px] cursor-pointer flex gap-[10px] items-center text-white hover:bg-white/10 rounded-lg px-4"
                        onClick={() => {
                            navigate("/partners")
                            onClose()
                        }}
                    >
                        <RxDashboard />
                        <p>Dashboard</p>
                    </span>
                    <span
                        className="w-[80%] h-[60px] cursor-pointer flex gap-[10px] items-center text-white hover:bg-white/10 rounded-lg px-4"
                        onClick={() => {
                            navigate("/partners/appointments")
                            onClose()
                        }}
                    >
                        <Calendar size={16} />
                        <p>Appointments</p>
                    </span>
                    {/* <span
                        className="w-[80%] h-[60px] cursor-pointer flex gap-[10px] items-center text-white hover:bg-white/10 rounded-lg px-4"
                        onClick={() => {
                            navigate("/partners/create-appointment")
                            onClose()
                        }}
                    >
                        <Plus size={16} />
                        <p>Create Appointment</p>
                    </span> */}
                    {/* <span
                        className="w-[80%] h-[60px] cursor-pointer flex gap-[10px] items-center text-white hover:bg-white/10 rounded-lg px-4"
                        onClick={() => {
                            navigate("/partners/patients")
                            onClose()
                        }}
                    >
                        <Users size={16} />
                        <p>Patients</p>
                    </span> */}
                    {/* <span
                        className="w-[80%] h-[60px] cursor-pointer flex gap-[10px] items-center text-white hover:bg-white/10 rounded-lg px-4"
                        onClick={() => {
                            navigate("/partners/settings")
                            onClose()
                        }}
                    >
                        <Settings size={16} />
                        <p>Settings</p>
                    </span> */}
                    <span
                        className="w-[80%] h-[60px] cursor-pointer flex gap-[10px] items-center text-white hover:bg-white/10 rounded-lg px-4"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <p>Logout</p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PartnerSidebar;

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { contextData } from "../../context/AuthContext";
import Avatar from "./Avatar";

export default function DropdownUser() {
	const { user, logout } = contextData();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

	// Close the dropdown when clicking outside of it
	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (!dropdown.current || !dropdownOpen) return;
			if (dropdown.current.contains(target) || trigger.current.contains(target)) return;
			setDropdownOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	// Close the dropdown if the escape key is pressed
	useEffect(() => {
		const keyHandler = ({ keyCode }: KeyboardEvent) => {
			if (!dropdownOpen || keyCode !== 27) return;
			setDropdownOpen(false);
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});

	return (
		<div className="relative">
			<button
				ref={trigger}
				onClick={() => setDropdownOpen(!dropdownOpen)}
				className="flex items-center gap-3 border border-gray-900 p-1.5 sm:pr-4 rounded-full"
			>
				{/* Use Avatar Component */}
				<Avatar
					firstName={user?.firstName || "J"}
					height="30px"
					width="30px"
				/>

				<span className="hidden lg:block font-bold text-[#383E49]">
					{user?.firstName} {user?.lastName?.charAt(0)}.
				</span>
			</button>

			{/* Dropdown Menu */}
			<div
				ref={dropdown}
				className={`absolute right-0 mt-4 w-fit flex flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
					dropdownOpen ? "block" : "hidden"
				}`}
			>
				<ul className="grid gap-5 px-6 py-5">
					<li>
						<Link
							to="/dashboard/patient/profile"
							className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out lg:text-base"
						>
							<FiUser className="text-2xl" />
							Profile
						</Link>
					</li>
				</ul>
				<button
					onClick={logout}
					className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out lg:text-base"
				>
					<CiLogout className="text-2xl" />
					Logout
				</button>
			</div>
		</div>
	);
}

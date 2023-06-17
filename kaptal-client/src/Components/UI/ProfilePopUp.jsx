import { logOut } from "../../Utils/LocalStorageUtils";
import { getUserData } from "../../Utils/LocalStorageUtils";
import { useNavigate, Link } from "react-router-dom";

export default function ProfilePopUp({ profilePopUpRef }) {
    const navigate = useNavigate();

    if (getUserData()) {
        return (
            <div ref={profilePopUpRef} className="absolute scale-0 z-10 top-0 right-0 origin-top-right opacity-0 pointer-events-none bg-white shadow-xl rounded-lg animated-300">
                <div className="h-[68px] text-lg flex-shrink-0 w-[150px] pl-3 flex flex-col justify-center">
                    <span className="font-bold">{getUserData().username}</span>
                    <span className={getUserData().role !== "user" ? "text-red-500" : "text-green-500"}>
                        {getUserData().role === "admin" ? "Администратор" : getUserData().role === "moderator" ? "Модератор" : "Пользователь"}
                    </span>
                </div>
                <div className="w-[280px] text-base flex flex-shrink-0 flex-col gap-2 justify-center px-3 pb-2 pt-4 items-start">
                    <button className="hover:text-sky-500">Заказы</button>
                    <button className="hover:text-sky-500">Настройки профиля</button>
                    <button
                        onClick={() => {
                            logOut();
                            navigate("/");
                        }}
                        className="hover:text-sky-500"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        );
    }
}

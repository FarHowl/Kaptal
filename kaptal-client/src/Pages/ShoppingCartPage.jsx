import { React, useState } from "react";
import { getShoppingCart_EP } from "../Utils/API";

export default function ShoppingCartPage() {
    const [booksList, setBooksList] = useState([]);

    async function getUserCart() {
        try {
            const res = await axios.get(getShoppingCart_EP, authToken_header());
            
            let a = [];
            for (const book of res.data) {
                a.push(<BookWideTile key={book._id} book={book} />);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1400px] w-full flex flex-col justify-center items-center mt-8 flex-wrap gap-y-16">
                <div className="flex flex-col gap-y-3 w-full">
                    <span className="text-3xl font-bold">Корзина</span>
                </div>
            </div>
        </div>
    );
}

function BookWideTile({ book }) {
    const firstRender = useRef(false);

    useEffect(() => {
        firstRender.current = true;
    }, []);
    return <div className="max-w-[700px] w-full rounded-md border-[1px] border-gray-100"></div>;
}

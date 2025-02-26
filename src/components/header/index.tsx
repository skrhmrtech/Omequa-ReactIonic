import { useHistory } from "react-router";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import TbMessageCircleStar from "../../assets/home/Query.png";

function Header({
    title,
    isBack = false,
}: {
    title: string,
    isBack?: boolean
}) {
    const history = useHistory();

    return (
        <div className='flex justify-between items-center w-full text-[#0f5999] '>
            <div className='flex gap-4 items-center'>
                {isBack && <IoChevronBackOutline className='text-2xl cursor-pointer' onClick={() => history.goBack()} />}
                <p className={`text-center ${isBack ? 'text-2xl' : 'text-3xl'} font-semibold`}>{title}</p>
            </div>
            <div className='flex gap-4'>
                <AiOutlineExclamationCircle className='text-2xl cursor-pointer' />
                <img src={TbMessageCircleStar} alt="" className='w-6 cursor-pointer' />
            </div>
        </div>
    )
}

export default Header

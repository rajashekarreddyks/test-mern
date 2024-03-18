'use client'
import { useState } from "react"

import CategoriesList from "./CategoriesList"
import PaginationComp from "./PaginationComp"
export interface CategoriesProps {
    categories: {
        name: string,
        checked: boolean,
        id: number
    }[]
}

const Categories: React.FC<CategoriesProps> = ({
    categories
}) => {
    
    const [page, setPage] = useState(0);

    return (
        <div className="w-full h-[calc(100vh-10rem)] flex items-center justify-center ">
            <div className="border w-[30rem] h-[30rem] py-10 px-14 rounded-xl flex flex-col gap-5">
                <h1 className="text-center text-2xl font-semibold">
                    Please mark your interests!
                </h1>
                <h1 className="text-center text-sm">
                    We will keep you notified
                </h1>
                <h1 className="">
                    My saved interests!
                </h1>

                <CategoriesList categories={categories} setPage={setPage} page={page} />
                <PaginationComp categories={categories} setPage={setPage} page={page} />

            </div>

        </div>
    )
}

export default Categories
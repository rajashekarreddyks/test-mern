import { ChevronLeft, ChevronRight, FastForward, Rewind } from "lucide-react"
import { useState } from "react";
import { CategoriesListProps } from "./CategoriesList";

const PaginationComp = ({
    categories,
    page,
    setPage
}:CategoriesListProps) => {
    const totalPages = Math.ceil(categories.length / 6);
    let numbers = [];
    for (let i = 0; i < totalPages; i++) {
        numbers.push(i);
    }
    const [pageNumbers, setPageNumbers] = useState<number[]>(numbers)
    const handlePageSelect = (i: number) => {
        setPage(i);
    }
    return (

            <div className="flex gap-3 text-neutral-500 w-full justify-between mt-auto">

                <div className="flex gap-5 mr-auto ">
                    <Rewind
                        onClick={() => setPage(0)}
                        className={`cursor-pointer ${page === 0 ? 'invisible' : ''}`}
                    />
                    <ChevronLeft
                        onClick={() => setPage(page - 1)}
                        className={`cursor-pointer ${page === 0 ? 'invisible' : ''}`}
                    />
                </div>

                <div className="flex text-center gap-3 ">

                    {
                        pageNumbers.slice((page > 3 ? page - 4 : 0), (page < totalPages - 3 ? page + 3 : totalPages)).map((i,index) => {
                            return (

                                <h1
                                    key={index}
                                    className={`cursor-pointer ${page === i ? 'font-bold text-black' : ''}`}
                                    onClick={() => handlePageSelect(i)} >
                                    {i + 1}
                                </h1>
                            )
                        })
                    }
                    ...
                </div>

                <div className="flex gap-5 ml-auto">

                    <ChevronRight
                        onClick={() => setPage(page + 1)}
                        className={`cursor-pointer ${page === totalPages - 1 ? 'invisible' : ''}`}
                    />
                    <FastForward
                        onClick={
                            () => setPage(totalPages - 1)}
                        className={`cursor-pointer ${page === totalPages - 1 ? 'invisible' : ''}`}
                    />
                </div>

            </div>

    )
}

export default PaginationComp
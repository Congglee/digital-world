import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { hotCollections } from 'src/constants/data'

export default function HotCollectionsSection() {
  return (
    <>
      <div className='text-[#151515] border-b-2 border-purple mb-5'>
        <h2 className='text-xl uppercase py-[15px] font-semibold'>Bộ sưu tập hot</h2>
      </div>
      <div className='grid xs:grid-cols-2 md:grid-cols-3 gap-4 mb-5'>
        {hotCollections.map((collection) => (
          <div
            className='p-[15px] border border-[#ebebeb] overflow-hidden flex flex-col lg:flex-row gap-5'
            key={collection.name}
          >
            <div className='xs:w-[175px] xs:h-[150px] mx-auto'>
              <img src={collection.thumb} alt={`${collection.name} thumbnail`} className='w-full h-full object-cover' />
            </div>
            <div className='flex-1 flex flex-col gap-[10px]'>
              <h4 className='uppercase font-semibold text-sm text-[#505050]'>{collection.name}</h4>
              <ul>
                {collection.brands.map((brand, idx) => (
                  <li className='mb-[5px]' key={idx}>
                    <Link to='#' className='text-gray-500 flex items-center text-sm hover:text-purple'>
                      <ChevronRight className='size-4 flex-shrink-0' />
                      <span>{brand}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

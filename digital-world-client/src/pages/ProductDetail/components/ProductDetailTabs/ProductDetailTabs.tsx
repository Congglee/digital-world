import DOMPurify from 'dompurify'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { tabOptions } from 'src/constants/options'
import { Product } from 'src/types/product.type'
import { cn } from 'src/utils/utils'
import ProductReview from '../ProductReview'
import { useAppSelector } from 'src/redux/hook'

interface ProductDetailTabsProps {
  product: Product
  nameId: string
}

const tabContentVariants: Variants = {
  initial: {
    // y: -50,
    visibility: 'hidden',
    opacity: 0
  },
  enter: {
    // y: 0,
    visibility: 'visible',
    opacity: 1
  }
}

export default function ProductDetailTabs({ product, nameId }: ProductDetailTabsProps) {
  const [isExpand, setIsExpand] = useState<boolean>(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [showReadMoreBtn, setShowReadMoreBtn] = useState<boolean>(false)
  const descriptionRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<{
    name: string
    label: string
  } | null>(null)

  useEffect(() => {
    setActiveTab(tabOptions[0])
    setShowReadMoreBtn(false)
  }, [nameId, isAuthenticated, product])

  useEffect(() => {
    if (descriptionRef.current) {
      const shouldShowReadMore = descriptionRef.current.scrollHeight !== descriptionRef.current.clientHeight
      setShowReadMoreBtn(shouldShowReadMore)
    }
  }, [activeTab, product])

  return (
    <div className='flex flex-col mt-[30px] overflow-hidden'>
      <ul className='flex flex-col md:flex-row flex-wrap gap-1'>
        {tabOptions.map((tab) => (
          <li key={tab.name}>
            <button
              className={cn(
                'w-full py-[9px] px-5 border-b-transparent uppercase text-[15px] border border-[#ebebeb] transition-all duration-500 hover:bg-white hover:text-black text-left md:text-center',
                activeTab && activeTab.name === tab.name ? 'text-black bg-white' : 'text-[#505050] bg-[#f1f1f1]'
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className='flex-1 -mt-[1px] p-5 border border-[#ebebeb]'>
        <AnimatePresence>
          <motion.div
            onAnimationComplete={() => {
              if (descriptionRef.current) {
                !showReadMoreBtn &&
                  setShowReadMoreBtn(descriptionRef.current.scrollHeight !== descriptionRef.current.clientHeight)
              }
            }}
            key={activeTab && activeTab.name}
            variants={tabContentVariants}
            initial='initial'
            animate='enter'
            transition={{ duration: 0.5 }}
          >
            {activeTab && activeTab.name === 'description' && (
              <div className='space-y-2'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description)
                  }}
                  ref={descriptionRef}
                  className={cn(isExpand ? '' : 'line-clamp-6')}
                />

                {showReadMoreBtn && (
                  <button
                    className='text-purple text-sm px-[10px] h-7 border border-purple rounded-sm leading-6 flex items-center gap-0.5'
                    onClick={() => setIsExpand(!isExpand)}
                  >
                    {isExpand ? (
                      <>
                        Thu gọn
                        <ChevronUp className='size-4' />
                      </>
                    ) : (
                      <>
                        Xem thêm
                        <ChevronDown className='size-4' />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
            {activeTab && activeTab.name === 'warranty' && (
              <div className='space-y-[10px] text-[#505050] text-sm'>
                <h2 className='text-xl font-semibold uppercase'>THÔNG TIN BẢO HÀNH</h2>
                <p>
                  CÁC BẢO HÀNH CÓ GIỚI HẠN
                  <br />
                  Các Bảo Hành Có Giới Hạn không được chuyển nhượng. Các Bảo Hành Có Giới Hạn sau đây được dành cho
                  người mua lẻ ban đầu của các Sản Phẩm của Ashley Furniture Industries, Inc.:
                </p>
                <p>
                  Khung Được Sử Dụng Trong Sản Phẩm Đệm Và Da
                  <br />
                  Bảo Hành Trọn Đời Có Giới Hạn
                  <br />
                  Một Bảo Hành Trọn Đời Có Giới Hạn được áp dụng cho tất cả các khung được sử dụng trong ghế sofa, ghế
                  đôi, ghế bành, ghế đẩu, ghế ottoman, ghế phòng khách, và giường ngủ. Ashley Furniture Industries, Inc.
                  đảm bảo với bạn, người mua lẻ ban đầu, rằng các bộ phận này không có bất kỳ khiếm khuyết về vật liệu
                  hoặc lỗi trong quá trình sản xuất.
                </p>
              </div>
            )}
            {activeTab && activeTab.name === 'delivery' && (
              <div className='text-[#505050] text-sm'>
                <h2 className='text-xl font-semibold uppercase'>MUA HÀNG & GIAO HÀNG</h2>
                Trước khi bạn mua đồ nội thất, điều quan trọng là bạn cần biết kích thước của khu vực dự định đặt đồ nội
                thất đó. Bạn cũng nên đo kích thước các lối đi, cửa ra vào và hành lang mà đồ nội thất sẽ đi qua để đến
                điểm đặt cuối cùng.
                <br />
                <h5 className='text-xs mb-1.5'>Nhận hàng tại cửa hàng</h5>
                Shopify Shop yêu cầu tất cả các sản phẩm phải được kiểm tra đầy đủ TRƯỚC KHI bạn mang về nhà để đảm bảo
                không có bất kỳ bất ngờ nào. Đội ngũ của chúng tôi sẵn sàng mở tất cả các gói hàng và hỗ trợ quá trình
                kiểm tra. Sau đó, chúng tôi sẽ đóng gói lại các sản phẩm để vận chuyển an toàn. Chúng tôi khuyên khách
                hàng nên mang theo đệm hoặc chăn để bảo vệ đồ nội thất trong quá trình vận chuyển, cũng như dây buộc
                hoặc dây cột. Shopify Shop sẽ không chịu trách nhiệm về bất kỳ hư hỏng nào xảy ra sau khi rời khỏi cửa
                hàng hoặc trong quá trình vận chuyển. Người mua có trách nhiệm đảm bảo nhận đúng sản phẩm và trong tình
                trạng tốt.
                <br />
                <h5 className='text-xs mb-1.5'>Giao hàng</h5>
                Khách hàng có thể chọn ngày giao hàng sớm nhất phù hợp với lịch trình của họ. Tuy nhiên, để sắp xếp lộ
                trình giao hàng hiệu quả nhất, Shopify Shop sẽ cung cấp khung giờ giao hàng. Khách hàng sẽ không thể
                chọn thời gian cụ thể. Bạn sẽ được thông báo trước về khung giờ giao hàng. Vui lòng đảm bảo có một người
                lớn (từ 18 tuổi trở lên) ở nhà vào thời gian đó.
                <br />
                Để chuẩn bị cho việc giao hàng, vui lòng dọn dẹp đồ nội thất cũ, tranh ảnh, gương, đồ trang trí, v.v. để
                tránh hư hỏng. Cũng đảm bảo khu vực bạn muốn đặt đồ nội thất mới được dọn dẹp sạch sẽ, không có bất kỳ
                vật cản nào có thể cản trở đường đi của đội giao hàng. Shopify Shop sẽ giao hàng, lắp đặt và sắp xếp đồ
                nội thất mới cho bạn, đồng thời dọn dẹp tất cả vật liệu đóng gói ra khỏi nhà. Đội giao hàng của chúng
                tôi không được phép di chuyển đồ nội thất hiện có hoặc các vật dụng khác trong nhà của bạn. Nhân viên
                giao hàng sẽ cố gắng giao hàng một cách an toàn và kiểm soát, nhưng sẽ không cố gắng đặt đồ nội thất nếu
                họ cảm thấy việc đó có thể gây hư hỏng cho sản phẩm hoặc ngôi nhà của bạn. Nhân viên giao hàng không thể
                tháo cửa, nâng đồ nội thất lên hoặc mang đồ nội thất lên trên ba tầng. Phải có thang máy để giao hàng từ
                tầng 4 trở lên.
              </div>
            )}
            {activeTab && activeTab.name === 'payment' && (
              <div className='text-[#505050] text-sm'>
                <h2 className='text-xl font-semibold uppercase'>MUA HÀNG & GIAO HÀNG</h2>
                Trước khi bạn mua đồ nội thất, điều quan trọng là bạn cần biết kích thước của khu vực dự định đặt đồ nội
                thất đó. Bạn cũng nên đo kích thước các lối đi, cửa ra vào và hành lang mà đồ nội thất sẽ đi qua để đến
                điểm đặt cuối cùng.
                <br />
                <h5 className='text-xs mb-1.5'>Nhận hàng tại cửa hàng</h5>
                Shopify Shop yêu cầu tất cả các sản phẩm phải được kiểm tra đầy đủ TRƯỚC KHI bạn mang về nhà để đảm bảo
                không có bất kỳ bất ngờ nào. Đội ngũ của chúng tôi sẵn sàng mở tất cả các gói hàng và hỗ trợ quá trình
                kiểm tra. Sau đó, chúng tôi sẽ đóng gói lại các sản phẩm để vận chuyển an toàn. Chúng tôi khuyên khách
                hàng nên mang theo đệm hoặc chăn để bảo vệ đồ nội thất trong quá trình vận chuyển, cũng như dây buộc
                hoặc dây cột. Shopify Shop sẽ không chịu trách nhiệm về bất kỳ hư hỏng nào xảy ra sau khi rời khỏi cửa
                hàng hoặc trong quá trình vận chuyển. Người mua có trách nhiệm đảm bảo nhận đúng sản phẩm và trong tình
                trạng tốt.
                <br />
                <h5 className='text-xs mb-1.5'>Giao hàng</h5>
                Khách hàng có thể chọn ngày giao hàng sớm nhất phù hợp với lịch trình của họ. Tuy nhiên, để sắp xếp lộ
                trình giao hàng hiệu quả nhất, Shopify Shop sẽ cung cấp khung giờ giao hàng. Khách hàng sẽ không thể
                chọn thời gian cụ thể. Bạn sẽ được thông báo trước về khung giờ giao hàng. Vui lòng đảm bảo có một người
                lớn (từ 18 tuổi trở lên) ở nhà vào thời gian đó.
                <br />
                Để chuẩn bị cho việc giao hàng, vui lòng dọn dẹp đồ nội thất cũ, tranh ảnh, gương, đồ trang trí, v.v. để
                tránh hư hỏng. Cũng đảm bảo khu vực bạn muốn đặt đồ nội thất mới được dọn dẹp sạch sẽ, không có bất kỳ
                vật cản nào có thể cản trở đường đi của đội giao hàng. Shopify Shop sẽ giao hàng, lắp đặt và sắp xếp đồ
                nội thất mới cho bạn, đồng thời dọn dẹp tất cả vật liệu đóng gói ra khỏi nhà. Đội giao hàng của chúng
                tôi không được phép di chuyển đồ nội thất hiện có hoặc các vật dụng khác trong nhà của bạn. Nhân viên
                giao hàng sẽ cố gắng giao hàng một cách an toàn và kiểm soát, nhưng sẽ không cố gắng đặt đồ nội thất nếu
                họ cảm thấy việc đó có thể gây hư hỏng cho sản phẩm hoặc ngôi nhà của bạn. Nhân viên giao hàng không thể
                tháo cửa, nâng đồ nội thất lên hoặc mang đồ nội thất lên trên ba tầng. Phải có thang máy để giao hàng từ
                tầng 4 trở lên.
              </div>
            )}
            {activeTab && activeTab.name === 'rate' && <ProductReview product={product} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

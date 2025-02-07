import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Pagination } from 'swiper/modules';
import banner1 from '../assets/banners/banner-1.png';
import banner2 from '../assets/banners/banner-2.png';
import banner3 from '../assets/banners/banner-3.png';
import banner4 from '../assets/banners/banner-4.png';
import banner5 from '../assets/banners/banner-5.png';
import { useEffect, useState } from 'react';
const banners = [banner1, banner2, banner3, banner4, banner5];

const BannerSlides: React.FC = () => {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 500) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="max-ctn !max-w-[900px] my-20">
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={30}
        loop
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay, Pagination]}
        className="flex justify-center"
      >
        {banners.map((banner, i) => (
          <SwiperSlide className="flex" key={i}>
            <img src={banner} alt="banner" className="w-full p-5 rounded" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerSlides;

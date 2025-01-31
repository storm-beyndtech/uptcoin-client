import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Pagination } from 'swiper/modules';
import banner1 from '../assets/35m.jpg';
import banner2 from '../assets/refer.jpg';
import banner3 from '../assets/bonus.jpg';
import banner4 from '../assets/defi.png';

const BannerSlides: React.FC = () => {
  const banners = [
    banner1,
    banner2,
    banner3,
    banner4,
    banner1,
    banner2,
    banner3,
    banner4,
  ];
  return (
    <section className="max-ctn !max-w-[900px] my-20">
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay, Pagination]}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {banners.map((banner, i) => (
          <SwiperSlide className="flex" key={i}>
            <img src={banner} alt="banner" className="w-70 h-28" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerSlides;

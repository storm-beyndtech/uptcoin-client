import logo from '../assets/logo.svg';

export default function PageLoader() {
  return (
    <section className="flex items-center justify-center h-screen bg-bodydark1">
      <div className="flex flex-col gap-5">
        <img src={logo} alt="logo" width={150} />
        <span className="flex w-4 h-[2px] rounded-full slideLoad bg-customGreen"></span>
      </div>
    </section>
  );
}

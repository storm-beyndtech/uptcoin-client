import { AiFillGithub } from 'react-icons/ai';
import { RiMailFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Footer() {
  return (
    <section className="bg-gray-950 text-white">
      <div className="flex w-full flex-col px-3 py-20 max-ctn">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:mr-20">
            <Link
              to="#"
              className="mb-12 inline-block max-w-full font-bold text-[#1353fe]"
            >
              <img className="h-9 w-auto" src={logo} alt="logo" />
            </Link>
            <div className="flex flex-col">
              <div>
                <h3 className="font-inter mb-4 mt-8 font-medium">EMAIL US</h3>
                <p className="font-inter text-base">support@uptcoin.com</p>
              </div>
            </div>
          </div>

          <div className="max-sm:mt-7 max-w-[700px] grow lg:flex lg:flex-row">
            {/* Other content */}
            <div className="flex grow flex-row flex-wrap lg:flex-nowrap lg:items-start">
              {/* Quick Links */}
              <div className="my-5 mr-8 flex max-w-[500px] grow basis-[100px] flex-col space-y-5 lg:my-0">
                <h2 className="font-inter font-medium">Quick Links</h2>
                <Link
                  to="/about"
                  className="font-inter font-light text-gray-500"
                >
                  About
                </Link>
                <Link
                  to="/about"
                  className="font-inter font-light text-gray-500"
                >
                  Business
                </Link>
                <Link
                  to="/exchange"
                  className="font-inter font-light text-gray-500"
                >
                  Exchange
                </Link>
                <Link
                  to="/market"
                  className="font-inter font-light text-gray-500"
                >
                  Market
                </Link>
              </div>

              {/* SUPPORT */}
              <div className="my-5 mr-8 flex max-w-[500px] grow basis-[100px] flex-col space-y-5 lg:my-0">
                <h2 className="font-inter font-medium">Support</h2>
                <Link
                  to="/faq"
                  className="font-inter font-light text-gray-500"
                >
                  Faq
                </Link>
                <Link
                  to="/press"
                  className="font-inter font-light text-gray-500"
                >
                  Knowledge Base
                </Link>
              </div>

              {/* Legal */}
              <div className="my-5 mr-8 flex max-w-[500px] grow basis-[100px] flex-col space-y-5 lg:my-0 lg:mr-0">
                <h2 className="font-inter font-medium">Legal</h2>
                <Link
                  to="/security"
                  className="font-inter font-light text-gray-500"
                >
                  Security
                </Link>
                <Link
                  to="/legal-statement"
                  className="font-inter font-light text-gray-500"
                >
                  Legal Statement
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 lg:flex lg:flex-row-reverse lg:justify-between">
          <div className="mb-8 mt-6 flex flex-row lg:mb-0 lg:mt-0 items-center">
            <Link to="/" className="mr-4 transition hover:text-gray-400">
              <RiMailFill size={26} />
            </Link>
            <Link to="/" className="mx-4 transition hover:text-gray-400">
              <AiFillGithub size={24} />
            </Link>
          </div>
          <p className="font-inter text-sm text-gray-500 lg:mt-0">
            © Copyright 2021. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

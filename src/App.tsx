import { Route, Routes, Navigate } from 'react-router-dom';

//importing pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PasswordReset from './pages/Auth/PasswordReset';
import PageLoader from './components/PageLoader';
import { contextData } from './context/AuthContext';
// import UpdateProfile from './components/UpdateProfile';
// import routes from './routes';
// import Dashboard from './pages/Dashboard/Dashboard';
// import DefaultLayout from './components/Layouts/DefaultLayout';
// import Admin from './pages/Admin/Admin';
// import AdminLayout from './components/Layouts/AdminLayout';
// import ActiveUsers from './pages/Admin/ActiveUsers';
// import ManageTrades from './pages/Admin/ManageTrades';
// import BannedUsers from './pages/Admin/BannedUsers';
// import ApprovedDeposits from './pages/Admin/ApprovedDeposits';
// import PendingDeposits from './pages/Admin/PendingDeposits';
// import RejectedDeposits from './pages/Admin/RejectedDeposits';
// import ApprovedWithdrawals from './pages/Admin/ApprovedWithdrawals';
// import PendingWithdrawals from './pages/Admin/PendingWithdrawals';
// import RejectedWithdrawals from './pages/Admin/RejectedWithdrawals';
// import Settings from './pages/Admin/Settings';
// import Kyc from './pages/Admin/Kyc';
import Support from './pages/Support';
import Market from './pages/Market';
import Exchange from './pages/Exchange';
import QuickMargin from './pages/QuickMargin';
import Press from './pages/Press';
import Rewards from './pages/Rewards';
import DefaultLayout from './components/Layouts/DefaultLayout';
import Transactions from './pages/Dashboard/Transactions';
import UserOverview from './pages/Dashboard/UserOverview';
import UserWallet from './pages/Dashboard/UserWallet';
import Conversion from './pages/Dashboard/Conversion';
import WalletAddress from './pages/Dashboard/WalletAddress';
import ChangePassword from './pages/Dashboard/ChangePassword';
import WithdrawalPassword from './pages/Dashboard/WithdrawalPassword';
import Affiliate from './pages/Dashboard/Affiliate';
import TradeRecords from './pages/Dashboard/TradeRecords';
import QuickContract from './pages/Dashboard/QuickContract';
import KYC from './pages/Dashboard/KYC';
import Deposit from './pages/Dashboard/Deposit';
import Withdraw from './pages/Dashboard/Withdraw';
import Transfer from './pages/Dashboard/Transfer';
import PrivateRoute from './components/PrivateRoute';
import About from './pages/About';
import AdminLayout from './components/Layouts/AdminLayout';
import UserAssetDetails from './components/UserAssetDetails';

function App() {
  const { fetching, user } = contextData();

  console.log(user);

  if (fetching) return <PageLoader />;

  if (!fetching)
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/exchange/:symbol" element={<Exchange />} />
        <Route path="/margin" element={<QuickMargin />} />
        <Route path="/margin/:symbol" element={<QuickMargin />} />
        <Route path="/press" element={<Press />} />
        <Route path="/Rewards" element={<Rewards />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />

        {/*    --    --   --   --  */}
        {/* Auth routes */}
        {/*    --    --   --   --  */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        <Route path="/admin/" element={<AdminLayout />}></Route>

        {/*    --    --   --   --  */}
        {/* Dashboard routes */}
        {/*    --    --   --   --  */}
        <Route
          path="/dashboard/"
          element={
            <PrivateRoute>
              <DefaultLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserOverview />} />
          <Route path="/dashboard/wallet" element={<UserWallet />} />
          <Route path="/dashboard/asset/:symbol" element={<UserAssetDetails />} />
          <Route path="/dashboard/deposit" element={<Deposit />} />
          <Route path="/dashboard/deposit/:symbol" element={<Deposit />} />
          <Route path="/dashboard/withdraw" element={<Withdraw />} />
          <Route path="/dashboard/withdraw/:symbol" element={<Withdraw />} />
          <Route path="/dashboard/transfer" element={<Transfer />} />
          <Route path="/dashboard/transfer/:symbol" element={<Transfer />} />
          <Route path="/dashboard/conversion" element={<Conversion />} />
          <Route
            path="/dashboard/conversion/:symbol"
            element={<Conversion />}
          />
          <Route path="/dashboard/wallet-address" element={<WalletAddress />} />
          <Route path="/dashboard/auth" element={<KYC />} />
          <Route
            path="/dashboard/change-password"
            element={<ChangePassword />}
          />
          <Route
            path="/dashboard/withdrawal-password"
            element={<WithdrawalPassword />}
          />
          <Route path="/dashboard/affiliate" element={<Affiliate />} />
          <Route path="/dashboard/transactions" element={<Transactions />} />
          <Route path="/dashboard/trade-records" element={<TradeRecords />} />
          <Route path="/dashboard/quick-contract" element={<QuickContract />} />
        </Route>

        {/*    --    --   --   --  */}
        {/* Catch-all for undefined routes */}
        {/*    --    --   --   --  */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
}

export default App;

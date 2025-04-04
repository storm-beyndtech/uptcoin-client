import { Route, Routes, Navigate } from 'react-router-dom';

//importing pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PasswordReset from './pages/Auth/PasswordReset';
import PageLoader from './components/PageLoader';
import { contextData } from './context/AuthContext';
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
import Admin from './pages/Admin/Admin';
import AddUser from './pages/Admin/AddUser';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageSingleUser from './pages/Admin/ManageSingleUser';
import UsersAccount from './pages/Admin/UsersAccount';
import UserAssets from './pages/Admin/UserAssets';
import UserAccountLimit from './pages/Admin/UserAccountLimit';
import ManageDeposits from './pages/Admin/ManageDeposits';
import ManageWithdrawals from './pages/Admin/ManageWithdrawals';
import ManageTraders from './pages/Admin/ManageTraders';
import TradeHistory from './pages/Admin/TradeHistory';
import AssetManagement from './pages/Admin/AssetManagement';
import AffiliateManagement from './pages/Admin/AffiliateManagement';
import AdminMails from './pages/Admin/AdminMails';
import useResponsiveChatVisibility from './hooks/useResponsiveChatVisibility';

function App() {
  const { fetching, user } = contextData();
  useResponsiveChatVisibility();

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

        {/*    --    --   --   --  */}
        {/* Admin routes */}
        {/*    --    --   --   --  */}

        <Route
          path="/admin/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="/admin/" element={<Admin />} />
          <Route path="/admin/add-user" element={<AddUser />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-user/:id" element={<ManageSingleUser />} />
          <Route path="/admin/users-account" element={<UsersAccount />} />
          <Route path="/admin/user-assets/:id" element={<UserAssets />} />
          <Route
            path="/admin/users-account-limit"
            element={<UserAccountLimit />}
          />
          <Route path="/admin/manage-deposits" element={<ManageDeposits />} />
          <Route
            path="/admin/manage-withdrawals"
            element={<ManageWithdrawals />}
          />
          <Route path="/admin/manage-traders" element={<ManageTraders />} />
          <Route path="/admin/trade-history" element={<TradeHistory />} />
          <Route path="/admin/manage-assets" element={<AssetManagement />} />
          <Route path="/admin/affiliate" element={<AffiliateManagement />} />
          <Route path="/admin/mails" element={<AdminMails />} />
        </Route>

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
          <Route
            path="/dashboard/asset/:symbol"
            element={<UserAssetDetails />}
          />
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

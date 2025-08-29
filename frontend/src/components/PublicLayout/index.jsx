import { Outlet } from 'react-router-dom';
import Header from '../Eyantra/Header/header';
const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* renders child routes */}
    </>
  );
};

export default PublicLayout;

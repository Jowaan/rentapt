import { HeaderLayout, AuthLayout } from "../../components";
const Home = () => {
  return (
    <div>
      <HeaderLayout title="Login" />
      <AuthLayout role="admin" />
    </div>
  );
};

export default Home;

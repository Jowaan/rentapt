import { HeaderLayout, AuthLayout } from "../components";
const Home = () => {
  return (
    <div>
      <HeaderLayout title="Login" />
      <AuthLayout role="user" />
    </div>
  );
};

export default Home;

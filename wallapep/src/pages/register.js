import CreateUserComponent from "./components/user/CreateUserComponent";

export default function RegisterPage({ openNotification, setLogin }) {

  return (
    <div>
      <CreateUserComponent openNotification={openNotification} setLogin={setLogin} />
    </div>
  );
}

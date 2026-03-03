import Sessions from "@/components/sessions/Sessions";

const SessionsPage = () => {
  return (
    <div className="page">
      <div className="page-content">
        <div className="page-header">
          <div className="page-title">
            <h1>Sessions</h1>
            <p>All imported simulator sessions - 865 shots tracked</p>
          </div>
        </div>
        <Sessions />
      </div>
    </div>
  );
};

export default SessionsPage;

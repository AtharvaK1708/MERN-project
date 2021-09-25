import { useSelector, useDispatch } from 'react-redux';

const Alert = () => {
  const alerts = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  return alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));
};

export default Alert;

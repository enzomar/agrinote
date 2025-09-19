import React from "react";
import { IonCard, IonCardContent } from "@ionic/react";
import { useHistory } from "react-router-dom";

interface Props {
  title: string;
  path: string;
}

const DashboardCard: React.FC<Props> = ({ title, path }) => {
  const history = useHistory();
  return (
    <IonCard button onClick={() => history.push(path)}>
      <IonCardContent className="ion-text-center">
        <h2>{title}</h2>
      </IonCardContent>
    </IonCard>
  );
};

export default DashboardCard;

import { FC } from "react";
import { JobList } from "./components/JobList";
import { PeriodSlider } from "./components/PeriodSlider";

const App: FC = () => (
  <div className="container">
    <h1>Job Progress Dashboard</h1>
    <PeriodSlider />
    <JobList />
  </div>
);

export default App;

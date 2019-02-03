// This component handles the App template used on every page.
import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import Header from "./common/Header";
import HomePage from "./home/HomePage";
import ManageCoursePage from "./courses/ManageCoursePage.Hooks"; //eslint-disable-line import/no-named-as-default
import AboutPage from "./about/AboutPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./common/Spinner";
import { connect } from "react-redux";
import { coursePropType } from "./propTypes";
import PageNotFound from "./PageNotFound";

// Lazy load the courses page. Just an example. Could do the same for others.
const CoursesPage = React.lazy(() => import("./courses/CoursesPage"));

const App = ({ courses }) => (
  <div className="container-fluid">
    {/* Note: Could choose to connect the header. But a good reminder that you should NOT connect all components.
    Pass props when components are close (yes, this app using Redux at all is overkill) */}
    <Header numCourses={courses.length} />
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/courses" component={CoursesPage} />
        {/* Key is shown here to show how ManageCoursePage could be remounted when courses are loaded. Thus, componentDidMount would re-run when the list of courses is loaded. However, using getDerivedStateFromProps since it is arguably simpler since it doesn't require this component to be connected to the Redux store. */}
        <Route
          path="/course/:slug"
          render={props => <ManageCoursePage {...props} key={courses.length} />}
        />
        <Route path="/course" component={ManageCoursePage} />
        <Route path="/about" component={AboutPage} />
        <Route render={PageNotFound} />
      </Switch>
    </Suspense>
    <ToastContainer autoClose={3000} hideProgressBar />
  </div>
);

App.propTypes = {
  courses: PropTypes.arrayOf(coursePropType).isRequired
};

function mapStateToProps(state) {
  return {
    courses: state.courses
  };
}

export default connect(mapStateToProps)(App);

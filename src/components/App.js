import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import fetchMoviesByCategory from '../actions/index';
import Home from './Home';
import Movie from './Movie';
import 'rc-pagination/assets/index.css';
import styles from './App.module.scss';

const App = ({
  dispatch, movies, loading, error,
}) => {
  const [page, setPage] = useState(1);
  const moviesById = useSelector(state => state.movies.items);
  const [category, setCategory] = useState('popular');

  useEffect(() => {
    dispatch(fetchMoviesByCategory(category, page));
  }, [page, category]);

  const changePage = e => {
    setPage(e);
  };

  const handleSelect = e => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <>
      <nav>
        <div className={styles.logo}>
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg"
            alt="TMDB Logo"
          />
        </div>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home
            movies={movies}
            loading={loading}
            error={error}
            changePage={changePage}
            page={page}
            handleSelect={handleSelect}
            category={category}
          />
        </Route>
      </Switch>

      {/* Routes for Movies */}
      {moviesById.results
        ? (
          <Switch>
            {
            moviesById.results.map(i => (
              <Route key={i.id} path={`/movie/${i.id}`}>
                <Movie id={i.id} />
              </Route>
            ))
            }
          </Switch>
        ) : null}
    </>
  );
};

const mapStateToProps = state => ({
  movies: state.movies.items,
  loading: state.movies.loading,
  error: state.movies.error,
});

App.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  movies: PropTypes.instanceOf(Object),
  dispatch: PropTypes.func.isRequired,
};

App.defaultProps = {
  error: null,
  loading: false,
  movies: null,
};

export default connect(mapStateToProps)(App);

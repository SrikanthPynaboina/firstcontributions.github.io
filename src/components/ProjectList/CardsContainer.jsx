import React from 'react';
import Select from 'react-select';
import each from 'lodash/each';

import Card from './ProjectsCards';
import projectList from './listOfProjects';

import './css/cards-container.css';
import './css/search.css';
import 'react-select/dist/react-select.css';

export default class CardsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [],
      filterList: this.sortArrayRandom(projectList),
      error: "",
    };

    this.setTags = new Set();
    this.filterOptions = [];
    this.valueList = [];

    for (let i = 0; i < projectList.length; i++) {
      if (projectList[i].tags) {
        projectList[i].tags.forEach((tag) => {
          projectList[i].tags.sort();
          this.setTags.add(tag.toLowerCase());
        });
      }
    }

    if (this.setTags.size) {
      this.setTags.forEach((v) =>
        this.filterOptions.push({ value: v, label: v })
      );
    }

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSelectChange(value) {
    this.value = value;
    this.setState({ value });
    this.handleFilterListUpdate(value);
  }

  handleFilterListUpdate(value) {
    let updatedList = [];

    // If no filters
    if (
      (!value || value.length === 0) &&
      (!this.inputValue || this.inputValue.length === 0)
    ) {
      return this.setState({
        filterList: this.sortArrayRandom(projectList),
        error: "",
      });
    }

    // If tags filter applied
    if (value && value.length > 0) {
      const valueList = [];

      value.map((v) => valueList.push(v.value));

      each(projectList, (project) => {
        if (!project.tags) return;

        let lowerCaseTags = project.tags.map((v) => v.toLowerCase());
        if (valueList.every((v) => lowerCaseTags.includes(v))) {
          updatedList.push(project);
        }
      });
    }

    // If search input value is not empty
    if (this.inputValue && this.inputValue.length > 0) {
      const searchedList = [];
      each(
        updatedList.length > 0 ? updatedList : projectList,
        (project) => {
          if (
            project.name.toLowerCase().includes(this.inputValue) ||
            project.description.toLowerCase().includes(this.inputValue) ||
            project.tags.toString().toLowerCase().includes(this.inputValue)
          ) {
            searchedList.push(project);
          }
        }
      );

      updatedList = searchedList;
    }

    // Update state with results or error message
    if (updatedList.length > 0) {
      this.setState({ filterList: updatedList, error: "" });
    } else {
      this.setState({
        filterList: [],
        error: `No results found for your search: "${this.inputValue}". Please try again.`,
      });
    }
  }

  // Search input handler
  handleChange(event) {
    this.inputValue = event.currentTarget.value.trim().toLowerCase();
    this.handleFilterListUpdate(this.value);
  }

  sortArrayRandom(array) {
    if (Array.isArray(array)) {
      return array.sort(() => 0.5 - Math.random());
    }
    return array;
  }

  render() {
    return (
      <div>
        <div id="container">
          <div className="inputContainer">
            <input
              id="search"
              type="text"
              name="search"
              placeholder="Search..."
              onChange={this.handleChange}
              aria-label="Search"
            />
          </div>
          <div id="tag-selector-container" className="inputContainer">
            <Select
              name="tag-selector"
              value={this.state.value}
              onChange={this.handleSelectChange}
              options={this.filterOptions}
              multi={true}
              placeholder={<div className="filter-placeholder-text">Filter</div>}
              aria-labelledby="tag-selector-container"
            />
          </div>
        </div>

        {this.state.error && (
          <div className='errorMessage'>
            {this.state.error}
          </div>
        )}

        <section id="project-list" className="containerLayout">
          {this.state.filterList.map((item, key) => {
            return (
              <Card
                key={key}
                name={item.name}
                logoLink={item.imageSrc}
                projectLink={item.projectLink}
                description={item.description}
                tags={item.tags}
                className="testing-testing"
              />
            );
          })}
        </section>
      </div>
    );
  }
}

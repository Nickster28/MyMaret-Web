import React, { Component, PropTypes } from "react";
import "../stylesheets/NewspaperSectionView.css";

class NewspaperSectionView extends Component {

    constructor(props) {
        super(props);
        this.onAddArticle = this.onAddArticle.bind(this);
        this.onDeleteSection = this.onDeleteSection.bind(this);
    }

    onAddArticle() {
        alert("Hi");
    }

    onDeleteSection() {

    }

	render() {
		return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {this.props.section.get("sectionName")}
                        <a id="deleteSectionButton"
                            onClick={this.onDeleteSection}>
                            <span className="glyphicon glyphicon-remove"></span>
                        </a>
                    </h3>
                </div>
                <ul className="list-group">
                    <li className="list-group-item">{"Item " + 1}</li>
                    <li className="list-group-item">{"Item " + 2}</li>
                    <li className="list-group-item">{"Item " + 3}</li>
                    <li className="list-group-item">{"Item " + 4}</li>
                    <li className="list-group-item">{"Item " + 5}</li>
                    <a id="addArticleRow" className="list-group-item"
                        onClick={this.onAddArticle}>
                        <span id="createEditionPlus"
                            className="glyphicon glyphicon-plus"
                            aria-hidden="true"></span>
                        Add Article
                    </a>
                </ul>
            </div>
        );
	}
}

NewspaperSectionView.propTypes = {
    section: PropTypes.object.isRequired
}

export default NewspaperSectionView;
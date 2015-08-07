'use strict';

var React = require('react');

var ReactBootstrap = require('../../assets/js/react-bootstrap.min.js');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;


var InputWithButton = React.createClass({


    getDefaultProps: function () {
        return {};
    },

    render: function(){
        return (
            <div {... this.props} >

            <p ><span >Basic panel</span></p>
            <Input type={'text'} placeholder={'Enter value'} addonBefore={'$'} buttonAfter={ <Button bsStyle={'default'} ><span >Default</span></Button> }></Input>

            </div>
        );
    }

});

module.exports = InputWithButton;

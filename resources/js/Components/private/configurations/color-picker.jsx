import React from "react";
import { ChromePicker } from "react-color";

class ColorPicker extends React.Component {
    state = {
        background: "#fff",
    };

    handleChangeComplete = (color) => {
        console.log(color);
        this.setState({ background: color.hex });
        this.props.handler(color.hex);
    };

    render() {
        return (
            <ChromePicker
                color={this.state.background}
                onChangeComplete={this.handleChangeComplete}
            />
        );
    }
}

export default ColorPicker;

let rgbaColor = "rgba('0,0,0,1')";

var picker = new Picker({    
        parent: document.querySelector('#colorPicker'),
        popup: 'bottom',
        color: '#000',
        editor: true,
        layout: 'default',
        editorFormat: 'hex'

});

picker.onChange = (color) => {
    rgbaColor = "rgba(\'" + color.rgba.toString() + "\')";
}


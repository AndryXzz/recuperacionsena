import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './UploaderFile.css'

const UploaderFile = (props) => {
  const { title = 'Cargar archivo', setFile } = props
  const [files, setFiles] = useState(null)
  const handleInputChange = (e) => {
    var tgt = e.target || window.event.srcElement,
      files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        setFile(info => ({
          ...info,
          evidence: fr.result,
          nameFile: files[0].name,
        }));
      }
      fr.readAsDataURL(files[0]);
    }
    setFiles(e.target.files[0])

  }
  return (
    <div >
      <input
        className="inputfile inputfile-6"
        data-multiple-caption="{count} files selected"
        id="file-7"
        multiple
        name="file-7[]"
        onChange={handleInputChange}
        type="file"
        accept="application/pdf"
      />
      <label htmlFor="file-7">
        <span>{files?.name}</span>
        <strong>
          <svg
            height="17"
            viewBox="0 0 20 17"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
          </svg> {title}&hellip;
        </strong>
      </label>

    </div >
  )
}

UploaderFile.propTypes = {
  file: PropTypes.object,
  onCancel: PropTypes.func,
  onUpload: PropTypes.func,
  setFile: PropTypes.object,
  title: PropTypes.string,
};

export default UploaderFile;


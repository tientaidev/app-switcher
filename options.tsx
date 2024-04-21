import { useStorage } from "@plasmohq/storage/hook";
import { localStorage } from "~localStorage";
import "./style.css";
import { useState } from "react";
import { isValidUrl } from "~utils";

const INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function OptionsIndex() {
  const [displayAlert, setDisplayAlert] = useState<boolean>(false);

  return (
    <div>
      {displayAlert && <SuccessAlert />}
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">Settings</h1>
      <div className="sm:rounded-lg">
        <table className="w-[600px] m-auto text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3">
                Index
              </th>
              <th scope="col" className="px-6 py-3">
                Url
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {INDEXES.map(index => <TableRow index={index} displayAlert={displayAlert} setDisplayAlert={setDisplayAlert} key={index} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableRow(props: { index: number, displayAlert: boolean, setDisplayAlert: (value: boolean) => void }) {
  const [url, _, { setStoreValue, setRenderValue }] = useStorage<string>({
    key: props.index.toString(),
    instance: localStorage,
  });

  const [isUrlValid, setIsUrlValid] = useState<boolean>(isValidUrl(url));

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRenderValue(e.target.value);
    setIsUrlValid(isValidUrl(e.target.value));
  }

  const handleOnSave = () => {
    setStoreValue();
    props.setDisplayAlert(true);
    setTimeout(() => props.setDisplayAlert(false), 2000);
  }

  return (
    <tr className="bg-white border-b">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {props.index}
      </th>
      <td className="px-6 py-4">
        <input
          type="url"
          name={`url_index_${props.index}`}
          placeholder="Enter URL"
          defaultValue={url}
          onChange={handleOnChange}
          className="w-96 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </td>
      <td className="flex items-center px-3 py-4">
        <button
          onClick={handleOnSave}
          className={isUrlValid ? "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center" : "text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"}
          disabled={!isUrlValid}
        >
          Save
        </button>
      </td>
    </tr>
  )
}

const SuccessAlert = () => {
  return (
    <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 duration-75" role="alert">
      <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">Success alert!</span> URL is saved
      </div>
    </div>
  )
}

export default OptionsIndex;
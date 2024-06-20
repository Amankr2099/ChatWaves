import React, { useContext } from "react";
import { ChatContext } from "./contextAPI/allContext";

export const ChatUser = () => {
  const { chatUser, aiCharacter } = useContext(ChatContext);

  return (
    <div
      className="modal fade"
      id="chatUser-profile"
      tabIndex="-1"
      aria-labelledby="chatUserLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            {aiCharacter ? (
              <>
                <img
                  src={aiCharacter.photoURL}
                  alt="img"
                  className="rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h3 className="d-block py-1">{aiCharacter.fullname}</h3>
                <h5 className="d-block py-1 text-info">
                  {aiCharacter.displayName}
                </h5>
                <span className="d-block py-1">
                  {aiCharacter.about}
                </span>
              </>
            ) : (
              <>
                <img
                  src={
                    chatUser.photoURL
                      ? chatUser.photoURL
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="img"
                  className="rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h3 className="d-block py-1">{chatUser.fullname}</h3>
                <h5 className="d-block py-1 text-info">
                  {chatUser.displayName}
                </h5>
                <span className="d-block py-1">
                  {chatUser.about && chatUser.about}
                </span>
              </>
            )}
          </div>
          <div className="modal-footer">
            
          </div>
        </div>
      </div>
    </div>
  );
};

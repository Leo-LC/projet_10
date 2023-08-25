import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  const nextCard = () => {
    setIndex(index < byDateDesc.length - 1 ? index + 1 : 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        nextCard();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused, nextCard]);

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div key={`slide-${event.title}`}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((ev, radioIdx) => (
                <input
                  key={`radio-${ev.title}`}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  readOnly
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;

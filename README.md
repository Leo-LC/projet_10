# DEBUG DU SITE

## Formulaire

> ### La modale de confirmation ne s'ouvrait pas
- Dans page/home, la modale doit apparaitre lors de l'envoi du message.
- J'ai donc ajouté la fonction onSuccess() en cas de réussite

```jsx
	<Modal
		Content={
			<div className="ModalMessage--success">
				<div>Message envoyé !</div>
				<p>
				Merci pour votre message nous tâcherons de vous répondre dans les plus brefs délais
				</p>
			</div>
		}
	>
		{({ setIsOpened }) => (
			<Form onSuccess={() => setIsOpened(true)} onError={() => null} />
		)}
	</Modal>;
```

```jsx
 const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
    const sendContact = useCallback(
			async (evt) => {
				evt.preventDefault();
				setSending(true);
				// We try to call mockContactApi
				try {
					await mockContactApi();
					setSending(false);
					onSuccess(); //! ajout de onSuccess() passé en props
				} catch (err) {
					setSending(false);
					onError(err);
				}
			},
			[onSuccess, onError]
		);
	};
```
## Encart du footer

> ### Ni l'image, ni le texte, ni le mois ne s'affichaient
 
- J'ai passé le lastEvent dans le useContext() pour pouvoir l'utiliser dans le footer

```jsx

	export const DataProvider = ({ children }) => {
		const [error, setError] = useState(null);
		const [data, setData] = useState(null);
		const [lastEvent, setLastEvent] = useState(null);
	
		const getData = useCallback(async () => {
			try {
				const newData = await api.loadData();
				setData(newData);
				setLastEvent(newData.events[0]);
			} catch (err) {
				setError(err);
			}
		}, []);
	
		useEffect(() => {
			getData();
		}, []);
	
		return (
			<DataContext.Provider
				value={{
					data,
					error,
					lastEvent,
				}}
			>
				{children}
			</DataContext.Provider>
		);
	};
```

- J'ai modifié le rendu du component en conditionnel pour ne charger que lorsque la data est disponible : 

```jsx
	{lastEvent && (
		<EventCard
			imageSrc={lastEvent?.cover}
			title={lastEvent?.title}
			date={new Date(lastEvent?.date)}
			small
			label="boom"
		/>
	)}	
```

- J'ai modifié le helper getMonth() pour passer le bon mois (Janvier commençant à 0 et non à 1)

```jsx
	export const MONTHS = {
	0: "janvier",
	1: "février",
	2: "mars",
	3: "avril",
	4: "mai",
	5: "juin",
	6: "juillet",
	7: "août",
	8: "septembre",
	9: "octobre",
	10: "novembre",
	11: "décembre",
};

export const getMonth = (date) => MONTHS[date.getMonth()];
```

## EVENTS SELECT

> ### Lorsqu'on sélectionnait un type d'event, la liste ne se mettait pas à jour

- J'ai changé le state de "collapsed" from newValue to true/false (newValue étant la valeur du type d'event sélectionné)

```jsx
	const [value, setValue] = useState();
	const [collapsed, setCollapsed] = useState(true);
	const changeValue = (newValue) => {
		onChange();
		setValue(newValue);
		setCollapsed(!collapsed);
	};
```

- J'ai le defaultCheck to true plutôt qu'une value pour que le radio button "Toutes" soit toujours sélectionné par défaut

```jsx
	{!titleEmpty && (
		<li onClick={() => changeValue(null)}>
			<input defaultChecked="true" name="selected" type="radio" />{" "}
			Toutes
		</li>
	)}
```
- J'ai passé la nouvelle Valeur dans la fonction onChange() du selecteur pour que la liste se mette à jour

```jsx
	<Select
		titleEmpty={titleEmpty}
		value={value}
		onChange={(newValue) => changeValue(newValue)}
	/>
```

- J'ai modifié le filteredEvents pour gérer le filtre en fonction du type avec .filter() ET la pagination avec .slice()

```jsx
	const filteredEvents = (
		(type
			? data?.events?.filter((event) => event.type === type)
			: data?.events) || []
		).slice((currentPage - 1) * PER_PAGE, PER_PAGE * currentPage);
```

## SLIDER

> ### Le slider comportait une slide vide.

- J'ai corrigé la fonction nextCard() pour que l'index ne dépasse pas la longueur du tableau

```jsx
	const nextCard = () => {
		setTimeout(
			() => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),
			5000
		);
	};
```

> ###  la console affichait le warning "Each child in a list should have a unique "key" prop."

- J'ai ajouté une div avec key au lieu d'un fragment.

```jsx
	<div className="SlideCardList">
			{byDateDesc?.map((event, idx) => (
				<div key={`slide-${event.title}`}>
				/* reste du code */
				</div>
			))}
	</div>
```

- Ajout d'une key unique ainsi qu'un readOnly sur les input radio.

```jsx
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
```

> ### En option, le client aurait aimé pouvoir arrêter le slider au press de la barre d'espace

- Ajout de la possibilité d'arrêter le slider au press de la barre d'espace :

```jsx
useEffect(() => {
		const interval = setInterval(() => {
			if (!isPaused) {
				nextCard();
			}
		}, 5000);

		const handleKeyDown = (e) => {
			if (e.key === " ") {
				setIsPaused(!isPaused);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			clearInterval(interval);
			document.removeEventListener("keydown", handleKeyDown);
		};
	});
```
- Refactorisation du useEffect() pour améliorer la lisibilité et la maintenabilité du code

```jsx
/* Création d'une fonction dédiée à l'appui de la barre d'espace */
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      setIsPaused(!isPaused);
    }
  };

/* Création d'un premier useEffect() pour gérer l'eventListener */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused]);

/* Création d'un second useEffect() pour gérer l'interval */
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
```
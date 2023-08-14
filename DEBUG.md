/* FORMULAIRE */

Dans page/home, cette Modal devrait apparaitre lors de l'envoi du message

<script>
	<Modal
		Content={
			<div className="ModalMessage--success">
				<div>Message envoyé !</div>
				<p>
					Merci pour votre message nous tâcherons de vous répondre dans les plus
					brefs délais
				</p>
			</div>
		}
	>
		{({ setIsOpened }) => (
			<Form onSuccess={() => setIsOpened(true)} onError={() => null} />
		)}
	</Modal>;
</script>

form : ajout de onSuccess() en cas de réussite

<script>
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

</script>


/* ENCART BAS DE PAGE */

L'image / texte / mois ne s'affichent pas. 

Il a fallu : 
	1 - Passer le last event dans le context (on aurait probablement pu récupérer uniquement le dernier event une fois dans le page/home, mais le component était toujours chargé avant l'async des data, pas trouvé de solution)
	Pour l'instant le lastEvent est automatiquement à [0]. 
	Est-il judicieux de le récupérer en fonction de la date ? 

<script>

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
				// eslint-disable-next-line react/jsx-no-constructed-context-values
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
</script>

	2 - Modifier le rendu du component en conditionnel pour ne charger que lorsque la data est disponible : 

<script>
	{lastEvent && (
							<EventCard
								imageSrc={lastEvent?.cover}
								title={lastEvent?.title}
								date={new Date(lastEvent?.date)}
								small
								label="boom"
							/>
						)}
</script>

	3 - Modifier le helper getMonth() pour passer le bon mois (Janvier commençant à 0 et non à 1)

<script>
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
</script>


/* EVENTS SELECT */

	1 - Changé le state de "collapsed" from newValue to true/false

<script>
	const [value, setValue] = useState();
	const [collapsed, setCollapsed] = useState(true);
	const changeValue = (newValue) => {
		onChange();
		setValue(newValue);
		setCollapsed(!collapsed);
	};
</script>

	2 - Changé le defaultCheck to true instead of a value : 

<script>
	{!titleEmpty && (
		<li onClick={() => changeValue(null)}>
			<input defaultChecked="true" name="selected" type="radio" />{" "}
			Toutes
		</li>
	)}
</script>

	3 - What is this ? 

<script>
	{/*  What is this ?  */}
	input type="hidden" value={value || ""} name={name} />
	{/*  What is this ?  */}
</script>

	4 - Passé la nouvelle Valeur dans la fonction onChange() du selecteur pour a faire remonter dans l'evtType de l'EventList component

<script>
	const changeValue = (newValue) => {
	setCollapsed(!collapsed);
	setValue(newValue);
	onChange(newValue);
		};
</script>

	5 - Modifié le filteredEvents pour gérer le filtre en fonction du type avec .filter() ET la pagination avec .slice()

<script>
	const filteredEvents = (
	(type
		? data?.events?.filter((event) => event.type === type)
		: data?.events) || []
		).slice((currentPage - 1) * PER_PAGE, PER_PAGE * currentPage);
</script>







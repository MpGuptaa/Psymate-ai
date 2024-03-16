import React from "react";
import PrismCode from "../../Components/Common/Prism";

const TeamModal = () => {
  const defaultModalCode = `
<!-- Default Modals -->

const [modal_team, setmodal_team] = useState(false);

    function tog_team() {
        setmodal_team(!modal_team);
    }

<Button color="primary" onClick={() => tog_team()}>Standard Modal</Button>

<Modal id="myModal"
        isOpen={modal_team}
        toggle={() => {
            tog_team();
        }}
>
    <ModalHeader>
        <h5
            className="modal-title"
            id="myModalLabel"
        >
            Modal Heading
        </h5>
        <Button
            type="button"
            className="btn-close"
            onClick={() => {
                setmodal_team(false);
            }}
            aria-label="Close"
        >
        </Button>
    </ModalHeader>
    <ModalBody>
        <h5 className="fs-15">
            Overflowing text to show scroll behavior
        </h5>
        <p className="text-muted">One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.</p>
        <p className="text-muted">The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought.</p>
        <p className="text-muted">It wasn't a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls.</p>
    </ModalBody>
    <ModalFooter>
        <Button
            color="light"
            onClick={() => {
                tog_team();
            }}
        >
            Close
        </Button>
        <Button
            color="primary"
        >
            Save changes
        </Button>
    </ModalFooter>
</Modal>
`;
  return (
    <PrismCode
      code={defaultModalCode}
      language={("js", "css", "html")}
      plugins={["line-numbers"]}
    />
  );
};

export default TeamModal;

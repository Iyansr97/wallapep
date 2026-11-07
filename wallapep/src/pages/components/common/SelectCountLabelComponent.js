let SelectCountLabelComponent = ({ icon, label, count }) => {
    return (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icon}
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
            <span>({count})</span>
        </span>
    );
}

export default SelectCountLabelComponent;

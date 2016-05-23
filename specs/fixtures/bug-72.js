function render(count) {
    return (
        <div>
        <FormattedMessage
    id="some.id"
    defaultMessage={`You have {count, plural,
                =0 {no Items}
        one {one Item}
                other {{count} Items} ${interpolated(`s1_${2}`)}
    }`}
            description="Description goes here"
            values={{ count }}
        />
        <MDBlock>
        {
        `You have {count, plural,
                =0 {no Items}
        one {one Item}
                other {{count} Items}
        }`}
        </MDBlock>
        </div>
    );
}
import { FormHelperText, Stack, TextField, TextFieldProps } from "@mui/material";

export type MsgCounterProps = TextFieldProps & {
  word: string;
  limit: number;
  count: number;
  charactersremaining: number;
};

export const MeteredMessageBox = (props: MsgCounterProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto' }}>
      <TextField
        {...props}
      />
      <FormHelperText component={'span'} style={{ ...props.style, marginTop: '-10px' }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          {
            <span>
              {props.charactersremaining} {props.word} remaining
            </span>
          }
          {(
            <span>
              {props.count}/{props.limit}
            </span>
          )}
        </Stack>
      </FormHelperText>
    </div>
  );
};
